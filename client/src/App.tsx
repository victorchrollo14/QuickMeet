import { useState } from "react";
import io from "socket.io-client";
import "./index.css";

// connect to socket.io server
const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState<string[]>(["no messages"]);
  const [yourMessage, setYourMessage] = useState("");

  const leaveChat = async () => {
    // disconnect from socket.io server.
    socket.disconnect();
  };

  // recieve message on "msg-from-server"
  socket.on("msg-from-server", (data) => {
    console.log([...messages, data]);
    setMessages([...messages, data]);
  });

  // sending message on "msg-from-client"
  const sendMessage = async () => {
    console.log(yourMessage);
    socket.emit("msg-from-client", yourMessage);
  };

  return (
    <>
      <div className="app">
        <h1>homepage</h1>
        <div className="message-box">
          {messages.map((message) => {
            return <li key={crypto.randomUUID()}>{message}</li>;
          })}
        </div>
        <input
          type="text"
          placeholder="enter message"
          className="input-msg"
          onChange={(e) => setYourMessage(e.target.value)}
        />{" "}
        <div className="buttons">
          <button
            style={{ background: "black", color: "white", padding: "15px" }}
            onClick={sendMessage}
          >
            SEND
          </button>
          <button
            style={{ background: "red", color: "white", padding: "15px" }}
            onClick={leaveChat}
          >
            {" "}
            leaveChat
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
