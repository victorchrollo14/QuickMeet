import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { logger } from "..";
import { joinMeet } from "../controllers/joinController";
import { broadCastMessage, getAllMessages } from "../controllers/msgController";
import { getRoomData } from "../controllers/roomController";
import { handleGuest } from "../controllers/guestController";

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

    socket.on("get-room", (params) => {
      getRoomData(socket, params);
    });

    // takes care of user and host joining the meet.
    socket.on("join", (params) => {
      console.log(params);
      joinMeet(io, socket, params, rooms, users);
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
    socket.on("localDescription", ({ description, to }) => {
      console.log(
        "getting offer from: ",
        users[socket.id].username,
        "\nand sending to: ",
        users[to].username
      );

      socket.to(to).emit("localDescription", { description, from: socket.id });
    });

    socket.on("remoteDescription", (params) => {
      const { description, to } = params;

      console.log(
        "getting answer from: ",
        users[socket.id].username,
        "sending to: ",
        users[to].username
      );

      socket.to(to).emit("remoteDescription", { description, from: socket.id });
      console.log("sent answer");
    });

    socket.on("iceCandidate", (params) => {
      const { candidate, to } = params;
      console.log("iceCandidate to: ", users[to].username);
      socket.to(to).emit("iceCandidate", { candidate, from: socket.id });
    });

    socket.on("iceCandidateReply", (params) => {
      const { candidate, to } = params;
      console.log(
        "getting iceCandidateReply from: ",
        users[socket.id].username,
        "sending to: ",
        users[to].username
      );
      socket.to(to).emit("iceCandidateReply", { candidate, from: socket.id });
    });

    socket.on("disconnect", () => {
      // iterating on the room keys, then removing the user from the room
      Object.keys(rooms).map((roomID) => {
        rooms[roomID].users = rooms[roomID].users.filter(
          (user: string) => user != socket.id
        );
      });

      // deleting user from users object as well.
      delete users[socket.id];
      console.log(socket.id, "user disconnected");
    });
  });

  return io;
};

export default initSocketServer;
