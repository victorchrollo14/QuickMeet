import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { logger } from "..";
import { startMeet } from "../controllers/meetController";
import { createGuest } from "../controllers/guestController";
import { handleJoin } from "../controllers/socketController";

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

    // socket.on("join-host", async (params: joinHost) => {
    //   const { userID, roomID, meetingID, roomType, role, userType, username } =
    //     params;

    //   const response = await startMeet(params);

    //   if (response.status === "error") {
    //     socket._error("some error occurred");
    //   }

    //   if (response.status === "ok") {
    //     users[socket.id] = {
    //       roomID: roomID,
    //       userID: userID,
    //       username: username,
    //       role: role,
    //       type: userType,
    //     };

    //     rooms[roomID] = {
    //       roomID: roomID,
    //       meetingID: meetingID,
    //       users: [],
    //       type: roomType,
    //     };
    //     rooms[roomID].users.push(socket.id);
    //     logger.info(`user added to room ${params.roomID}`);
    //     console.log(rooms, users);
    //   }
    // });

    socket.on("join", (params) => {
      // takes care of user join operation.
      
      handleJoin(socket, params, rooms, users);
    });

    socket.on("msg-to-server", (params) => {
      const roomID = params.roomID;
      const message = params.message;
      const otherUsers = rooms[roomID].users; // selecting all users from your room

      // sends message to other users in the particular room
      otherUsers.forEach((user: string) => {
        if (user !== socket.id) {
          console.log(user, otherUsers);
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
