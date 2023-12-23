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
      console.log(users);
    });

    socket.on("msg-to-server", (params, callback) => {
      broadCastMessage(io, socket, params, rooms, users, callback);
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
      console.log("getting offer from: ", socket.id);

      otherUsers.forEach((user: string) => {
        if (user !== socket.id) {
          console.log(user, otherUsers);
          io.to(user).emit("localDescription", {
            description: localDescription,
          });
        }
      });
    });

    socket.on("remoteDescription", (params) => {
      const roomID = users[socket.id].roomID;
      const otherUsers = rooms[roomID].users;
      const remoteDescription = params.description;
      console.log("getting answer from: ", socket.id);

      otherUsers.forEach((user) => {
        if (user !== socket.id) {
          io.to(user).emit("remoteDescription", {
            description: remoteDescription,
          });
        }
      });
    });

    socket.on("iceCandidate", (params) => {
      const roomID = users[socket.id].roomID;
      console.log("Getting iceCandidates from:", socket.id);
      const otherUsers = rooms[roomID].users;

      otherUsers.forEach((user) => {
        if (user !== socket.id) {
          io.to(user).emit("iceCandidate", {
            cadidate: params.candidate,
          });
        }
      });
    });

    socket.on("iceCandidateReply", (params) => {
      const roomID = users[socket.id].roomID;
      console.log("getting iceCandidate reply from:", socket.id);
      const otherUsers = rooms[roomID].users;

      otherUsers.forEach((user) => {
        if (user !== socket.id) {
          io.to(user).emit("iceCandidateReply", {
            cadidate: params.candidate,
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
