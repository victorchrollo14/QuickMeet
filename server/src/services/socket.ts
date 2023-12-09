import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { logger } from "..";
import { startMeet } from "../controllers/meetController";
import { createGuest } from "../controllers/guestController";
import { handleJoin, handleMessages } from "../controllers/socketController";

interface joinHost {
  username: string;
  userID: string;
  roomID: string;
  meetingID: string;
  roomType: string;
  role: string;
  userType: string;
}

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
  const guests = {};

  io.on("connection", (socket) => {
    logger.info("a user connected", socket.id);

    // takes care of user and host joining the meet.
    socket.on("join", (params) => {
      handleJoin(socket, params, rooms, users);
      console.log(rooms, users);
    });

    socket.on("msg-to-server", (params) => {
<<<<<<< HEAD
      const roomID = params.roomID;
      const message = params.message;
      const otherUsers = rooms[roomID].users; // selecting all users from your room
console.log(message);
      // sends message to other users in the particular room
      otherUsers.forEach((user: string) => {
        if (user !== socket.id) {
          console.log(user, otherUsers);
          io.to(user).emit("msg-to-client", message);
        }
      });
=======
      handleMessages(io, socket, params, rooms, users);
>>>>>>> d8b8210cdf306b05f386861815969d39fb3a4cee
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
