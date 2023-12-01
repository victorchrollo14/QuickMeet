import { Server } from "socket.io";
import { Server as HttpServerType } from "http";
import { logger } from "..";
import { startMeet } from "../controllers/meetController";

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

    socket.on("join-host", async (params: joinHost) => {
      const { userID, roomID, meetingID, roomType, role, userType, username } =
        params;

      const response = await startMeet(params);

      if (response.status === "error") {
        socket._error("some error occurred");
      }

      if (response.status === "ok") {
        users[socket.id] = {
          roomID: roomID,
          userID: userID,
          username: username,
          role: role,
          type: userType,
        };

        rooms[roomID] = {
          roomID: roomID,
          meetingID: meetingID,
          users: [],
          type: roomType,
        };
        rooms[roomID].users.push(socket.id);
        logger.info(`user added to room ${params.roomID}`);
        console.log(rooms, users);
      }
    });

    socket.on("join", (params) => {
      const { userID, userType, roomID, username } = params;
      // registered user: private room or guest room;
      // guest user: guest room, send a message if he tries to join private room,
      // that the data will be saved.
      const roomType = rooms[roomID].roomType;

      if (userType === "guest" && roomType === "public") {
        // register in guests table.
      } else if (userType === "guest" && roomType === "private") {
      } else if (userType === "registered" && roomType === "private") {
      } else {
        users[socket.id] = {
          roomID: roomID,
          user_id: userID,
          username: username,
          role: "attendee",
          type: userType,
        };

        rooms[roomID].users.push(socket.id);
        console.log(username, "added to room:", roomID);
      }
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
