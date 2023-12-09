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
      handleMessages(io, socket, params, rooms, users);
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
