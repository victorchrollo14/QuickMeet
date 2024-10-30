import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SocketConnect from "../components/SocketConnect";

import { Socket } from "socket.io-client";

import BeforeJoin from "../components/BeforeJoin";
import AferJoin from "../components/AferJoin";
import { getCurrentUser, updateUserList } from "../utils/webrtcHandler";
import { useAppSelector } from "../redux/hooks";
import { room } from "../redux/roomReducer";

export interface streams {
  id: string;
  stream: MediaStream;
}

export type joinStatus = "loading" | "joined" | "error";

export type mainView = "local" | "remote";
export type userObject = {
  [socketId: string]: {
    pc: RTCPeerConnection | null;
    stream: MediaStream;
    username: string;
    userID: string;
    userType: string;
  };
};
const pcConfig = {
  iceServers: [
    {
      urls: "stun:stun.relay.metered.ca:80",
    },
    {
      urls: "turn:standard.relay.metered.ca:80",
      username: "59d18d15e0e0ab53643e84a2",
      credential: "RU6/Y/1oSqMGZ0YX",
    },
  ],
};

const users: userObject = {};

function Meet() {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<
    MediaStream[] | null | undefined
  >([]);

  const params = useParams();
  const roomID = params.id;

  const [enterRoom, setEnterRoom] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [joinStatus, setJoinStatus] = useState<joinStatus>("loading");

  const roomDetails: room = useAppSelector((state) => state.room);

  SocketConnect(setSocket, setError, setJoinStatus);

  useEffect(() => {
    socket?.on("userList", (data: userObject) => {
      updateUserList(data, users);

      const streamIds: Array<string> = [];
      Object.keys(users).forEach((user) => {
        if (users[user].stream) {
          const id = users[user].stream.id;
          streamIds.push(id);
        }
      });

      console.log(streamIds);

      setRemoteStreams((prevStreams) => {
        if (prevStreams) {
          return prevStreams?.filter((prevStream) =>
            streamIds.includes(prevStream.id),
          );
        } else {
          return prevStreams;
        }
      });
    });

    socket?.on("localDescription", async ({ description, from }) => {
      const pc = new RTCPeerConnection(pcConfig);
      users[from].pc = pc;

      console.log(description, { from: users[from].username });

      pc?.setRemoteDescription(description);

      console.log({ insideRoom: enterRoom });
      if (enterRoom) {
        localStream?.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

      pc.ontrack = (event) => {
        const track = event.track;
        console.log({ track: track.kind });

        const { stream } = users[from];
        if (!stream) users[from].stream = new MediaStream();

        users[from].stream.addTrack(track);

        setRemoteStreams((prevStreams) => {
          // add first stream if prevStreams is null
          if (!prevStreams) {
            return [users[from].stream];
          } // adding new Stream to array.

          const isStreamPresent = prevStreams?.some(
            (prevStream) => prevStream.id === users[from].stream.id,
          );

          let updatedStreams = prevStreams.map((prevStream) =>
            prevStream.id === users[from].stream.id
              ? users[from].stream
              : prevStream,
          );

          if (!isStreamPresent) {
            console.log({ streamPresent: isStreamPresent });
            updatedStreams = [...updatedStreams, users[from].stream];
          }

          console.log(updatedStreams);

          return updatedStreams;
        });
      };

      socket?.on("iceCandidate", ({ candidate, from }) => {
        const pc = users[from].pc;
        console.log(`getting iceCandidate from ${users[from].username}`);
        pc?.addIceCandidate(candidate);
      });

      pc.onicecandidate = ({ candidate }) => {
        socket.emit("iceCandidateReply", { candidate, to: from });
      };

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("remoteDescription", {
        description: pc.localDescription,
        to: from,
      });
    });

    socket?.on("remoteDescription", async ({ description, from }) => {
      console.log(from, users[from].pc);
      console.log(description);

      const pc = users[from].pc;

      pc?.setRemoteDescription(description);

      if (pc) {
        pc.ontrack = (e) => {
          const track = e.track;
          console.log({ track: track.kind });

          const { stream } = users[from];
          if (!stream) users[from].stream = new MediaStream();

          users[from].stream.addTrack(track);

          setRemoteStreams((prevStreams) => {
            // add first stream if prevStreams is null
            if (!prevStreams) {
              return [users[from].stream];
            } // adding new Stream to array.

            const isStreamPresent = prevStreams?.some(
              (prevStream) => prevStream.id === users[from].stream.id,
            );

            let updatedStreams = prevStreams.map((prevStream) =>
              prevStream.id === users[from].stream.id
                ? users[from].stream
                : prevStream,
            );

            if (!isStreamPresent) {
              updatedStreams = [...updatedStreams, users[from].stream];
            }
            console.log(updatedStreams);

            return updatedStreams;
          });
          // console.log(
          //   users[from].stream.getAudioTracks()[0],
          //   users[from].stream.getVideoTracks()[0]
          // );
        };

        console.log(pc.connectionState);
      }

      socket?.on("iceCandidateReply", ({ candidate, from }) => {
        const pc = users[from].pc;
        pc?.addIceCandidate(candidate);
      });

      console.log("connection established");

      // pc.setRemoteDescription(description);

      //   pc.ontrack = (e) => {
      //     console.log(e.track);
      //     const video = e.track.enabled;
      //     const audio = e.track.enabled;
      //     setConfig({ video, audio });

      //     remoteStream?.addTrack(e.track);
      //     setRemoteStream((prevState) => {
      //       if (prevState) prevState.addTrack(e.track);
      //       return prevState;
      //     });
      //   };

      //   socket?.on("iceCandidate", ({ candidate }) => {
      //     pc.addIceCandidate(candidate);
      //   });

      //   pc.onicecandidate = ({ candidate }) => {
      //     socket?.emit("iceCandidateReply", { candidate });
      //   };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, enterRoom]);

  async function join() {
    try {
      const currentUser = await getCurrentUser(users, roomDetails);

      const otherUsers = Object.fromEntries(
        Object.entries(users).filter(([socketId]) => socketId !== currentUser),
      );

      for (const [socketId] of Object.entries(otherUsers)) {
        const pc = new RTCPeerConnection(pcConfig);
        users[socketId].pc = pc;

        pc.onicecandidate = (e) => {
          const candidate = e.candidate;

          socket?.emit("iceCandidate", { candidate, to: socketId });
        };

        localStream?.getTracks().forEach((track) => {
          console.log(track);
          pc.addTrack(track, localStream);
        });

        console.log(pc.connectionState);
        if (
          pc.connectionState === "connected" ||
          pc.connectionState === "connecting"
        ) {
          return;
        }

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        console.log(pc);

        socket?.emit("localDescription", {
          description: pc.localDescription,
          to: socketId,
        });
      }
    } catch (err) {
      console.log(err);
    }
    setEnterRoom(true);
  }

  return (
    <>
      {enterRoom === false ? (
        <BeforeJoin
          localStream={localStream}
          setLocalStream={setLocalStream}
          join={join}
          error={error}
          joinStatus={joinStatus}
        />
      ) : (
        <AferJoin
          localStream={localStream}
          setLocalStream={setLocalStream}
          remoteStreams={remoteStreams}
          socket={socket}
          roomID={roomID}
        />
      )}
    </>
  );
}

export default Meet;
