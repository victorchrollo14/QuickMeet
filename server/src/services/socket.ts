import { Server } from "socket.io";
import { Server as HttpServerType } from "http";

const initSocketServer = (server: HttpServerType) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  const rooms = {};
  const users = {};

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("join", (params) => {
      console.log("joined room", params.roomID);
    });

    socket.on("disconnect", () => {
      console.log(socket.id, "user disconnected");
    });
  });

  return io;
};

export default initSocketServer;
