import React, { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Video from "./Video";
import RemoteVideo from "./remoteVideo";
import MessagingBoard from "./MessagingBoard";
import Footer from "./Footer";

interface Props {
  localStream: MediaStream | null;
  setLocalStream: Dispatch<SetStateAction<MediaStream | null>>;
  remoteStreams: MediaStream[] | null | undefined;
  socket: Socket | null;
  roomID: string | undefined;
}

const AferJoin: React.FC<Props> = ({
  localStream,
  setLocalStream,
  remoteStreams,
  socket,
  roomID,
}) => {
  console.log(remoteStreams);

  return (
    <div className="bg-white pt-5 min-h-screen">
      <section className="px-0">
        <div className="px-10 mr-0 max-w[1440px] flex gap-[1rem] justify-between">
          <div className="flex flex-col gap-[1rem] max-w-[85vw] tablet:max-w-[55vw]  ">
            <div className="localVideo  w-[65vw]   max-h-[75vh] relative bg-extra-light-grey">
              <Video
                id={localStream?.id}
                localStream={localStream}
                setLocalStream={setLocalStream}
                autoRun={false}
              />
            </div>
            <div className="remote flex flex-row gap-3">
              {remoteStreams?.map((remoteStream) => (
                <div
                  key={crypto.randomUUID()}
                  // onClick={SwitchMainScreen}
                  className="small-screen flex gap-[1rem] h-40 w-64 justify-between"
                >
                  <RemoteVideo remoteStream={remoteStream} />
                </div>
              ))}
            </div>
          </div>
          <MessagingBoard socket={socket} roomID={roomID} />
        </div>
      </section>
      <section className="px-[3rem] ">
        <Footer />
      </section>
    </div>
  );
};

export default AferJoin;
