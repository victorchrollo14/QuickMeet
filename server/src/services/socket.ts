import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { logger } from "..";
import { joinMeet } from "../controllers/joinController";
import { broadCastMessage, getAllMessages } from "../controllers/msgController";
import { getRoomData } from "../controllers/roomController";
import { handleGuest } from "../controllers/guestController";
import { log } from "winston";

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

  io.on("connection", (socket) => {
    logger.info("a user connected", socket.id);

    socket.on("create-guest", () => {
      handleGuest(socket);
    });

    socket.on("get-room", (params) => {
      getRoomData(socket, params);
    });

    // takes care of user and host joining the meet.
    socket.on("join", (params) => {
      joinMeet(socket, params, rooms, users);
      console.log(users)
    });

    socket.on("msg-to-server", (params) => {
      broadCastMessage(io, socket, params, rooms, users);
      console.log(rooms);
    });

    socket.on("all-messages", (params) => {
      // allMessages controller.
      getAllMessages(socket, params);
      console.log(rooms);
    });

    // video parts
    socket.on("localDescription", (params) => {
      const roomID = users[socket.id].roomID;
      console.log(roomID);

      const otherUsers = rooms[roomID].users;
      const localDescription = params.description;
      console.log(localDescription);

      otherUsers.forEach((user: string) => {
        console.log(otherUsers);
        if (user !== socket.id) {
          console.log(user, otherUsers);
          io.to(user).emit("localDescription", {
            description: localDescription,
          });
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
