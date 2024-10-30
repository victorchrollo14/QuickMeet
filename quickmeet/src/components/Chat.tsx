import React from "react";
import { chatParams } from "./MessagingBoard.js";
import avatar from "../assets/images/Avatar.jpg";

interface Chat {
  chat: chatParams;
  userID: string | null;
}

const Chat: React.FC<Chat> = ({ chat, userID }) => {
  return (
    <div
      className={`message m-[0.5rem] flex items-center ${
        chat.userID == userID ? "flex-row-reverse" : ""
      } `}
    >
      <img
        src={chat.profilePic ? chat.profilePic : avatar}
        className="h-10 w-10 rounded-[20px] mx-[1rem] "
      />
      <div className="flex flex-col ">
        <span
          className={`text-[0.81rem] mb-1 inline-block text-black ${
            chat.userID == userID ? "text-end" : ""
          }`}
        >
          {chat.userID == userID ? "You" : chat.username}
        </span>
        <div className="msg-body bg-white w-full py-[0.56rem] min-w-[100px] px-[0.81rem] rounded-br-lg max-w-xs">
          <p className="text-[0.8125rem] opacity-100">{chat.message} </p>
          <p className="text-[0.625rem] text-light-grey opacity-[0.8] block text-end">
            {chat.time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
