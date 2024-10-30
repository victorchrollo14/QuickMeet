import send from "../assets/images/send.svg";
import uploadPhoto from "../assets/images/photo.svg";
import { FormEvent, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";
import { room } from "../redux/roomReducer";
import Chat from "./Chat";

interface MessagingBoard {
  socket: Socket | null;
  roomID: string | undefined;
}

export interface chatParams {
  userID: string | null;
  message: string | undefined;
  username: string | null;
  profilePic: string | null;
  time: string;
}

const formatDate = (time: string) => {
  const date = new Date(time);
  const formattedTime = date.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return formattedTime;
};

const MessagingBoard: React.FC<MessagingBoard> = ({ socket, roomID }) => {
  const [chatData, setChatData] = useState<chatParams[]>([]);
  const [yourMessage, setYourMessage] = useState<string>("");
  const roomDetails: room = useAppSelector((state) => state.room);
  const user = JSON.parse(localStorage.getItem("userInformation") || "null");
  let profilePic: string | null;
  if (user) {
    profilePic = user.profile_pic;
  }

  useEffect(() => {
    socket?.on("msg-to-client", (params: chatParams) => {
      params.time = formatDate(params.time);
      setChatData((chatData) => [...chatData, params]);
    });

    console.log(roomDetails);

    if (roomDetails) {
      const { meetingID, roomType, userID, userType } = roomDetails;
      socket?.emit("all-messages", { meetingID, roomType, userID, userType });
      socket?.on("all-messages", (params) => {
        params.forEach((param: { time: string }) => {
          param.time = formatDate(param.time);
        });
        console.log(params);

        setChatData(params);
      });
    }
  }, [socket, roomDetails]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const currentTime = new Date().toLocaleTimeString("en-US", {
      timeStyle: "short",
    });

    if (yourMessage) {
      const response = await socket
        ?.timeout(5000)
        .emitWithAck("msg-to-server", { message: yourMessage, roomID: roomID });

      if (response.status) {
        setChatData([
          ...chatData,
          {
            userID: roomDetails.userID,
            message: yourMessage,
            profilePic: profilePic,
            time: currentTime,
            username: roomDetails.username,
          },
        ]);
        setYourMessage("");
      }
    }
  };

  return (
    <div className=" max-w-md bg-extra-light-grey w-full  flex flex-col overflow-hidden justify-between">
      <div className="messages rounded-[8px] my-[1.38rem] ml-[0.38rem] mr-[1rem] flex flex-col overflow-scroll">
        {chatData &&
          chatData.map((chat) => (
            <Chat
              key={crypto.randomUUID()}
              userID={roomDetails.userID}
              chat={chat}
            />
          ))}
      </div>

      <div className="userInputMessage relative m-[1.38rem] rounded-[8px] border-none ">
        <form onSubmit={(e) => sendMessage(e)}>
          <input
            type="text"
            value={yourMessage}
            className="w-full h-[2.75rem] border-none px-[40px]"
            onChange={(e) => setYourMessage(e.target.value)}
          />
          <button className="absolute px-2 top-0 left-0 bg-opacity-0 bg-transparent border-none">
            <img src={uploadPhoto} />
          </button>
          <button
            type="submit"
            className="send-message px-2 absolute top-0 right-0 bg-transparent border-none"
          >
            <img src={send} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default MessagingBoard;
