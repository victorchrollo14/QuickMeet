import { Server } from "socket.io";
import { Server as HttpServerType } from "http";

const initSocketServer = (server: HttpServerType) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://quickmeet.tech",
        "https://quickmeet-omega.vercel.app",
      ],
    },
  });

  const rooms = {};
  const users = {};

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("join", (params) => {
      const roomID = params.roomID;
      users[socket.id] = {
        roomID: roomID,
      };

      // create a new room if it doesn't exist
      if (!rooms[roomID]) {
        rooms[roomID] = {
          roomID: roomID,
          users: [],
        };
      }

      rooms[roomID].users.push(socket.id);
      console.log("user added to room", roomID);
    });

    socket.on("msg-to-server", (params) => {
      console.log(params);
      const roomID = params.roomID;
      const message = params.message;
      const otherUsers = rooms[roomID].users; // selecting all users from your room

      // sends message to other users in the particular room
      otherUsers.forEach((user: string) => {
        if (user !== socket.id) {
          console.log(user, socket.id, otherUsers.length);
          io.to(user).emit("msg-to-client", message);
        }
      });
    });

    socket.on("disconnect", () => {
      // iterating on the room keys, then removing the user from the room
      Object.keys(rooms).map((roomID) => {
        rooms[roomID].users = rooms[roomID].users.filter(
          (user: string) => user != socket.id
        );
      });
      delete users[socket.id];
      console.log(socket.id, "user disconnected");
    });
  });

  return io;
};

export default initSocketServer;
