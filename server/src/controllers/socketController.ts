import { Server, Socket } from "socket.io";
import { createGuest } from "./guestController";
import { addParticipant } from "./userController";
import { addGuestParticipant } from "./guestController";
import { startMeet } from "./meetController";
import { logger } from "..";
import { IOType } from "child_process";
import {
  saveGstToPrivate,
  saveGstToPublic,
  saveRegToPrivate,
  saveRegToPublic,
} from "./msgController";

export interface joinParameters {
  userID: string | null;
  username: string | null;
  userType: string;
  role: string | null;
  meetingID: string | null;
  roomID: string;
  roomType: string | null;
}

const joinHost = async (
  socket: Socket,
  params: joinParameters,
  rooms: Object,
  users: Object
) => {
  const { roomID, userID, username, role, userType, roomType, meetingID } =
    params;
  const response = await startMeet(params);
  console.log(response);

  if (response.status === "error") {
    throw new Error("Invalid credentials");
  } else if (response.status === "ok") {
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
    logger.info(`host added to room ${params.roomID}`);
    console.log(rooms, users);
  }
};

const handleJoin = async (
  socket: Socket,
  params: joinParameters,
  rooms: Object,
  users: Object
) => {
  try {
    let { userID, userType, roomID, username, roomType, meetingID, role } =
      params;

    console.log(params);

    if (role === "host") {
      return joinHost(socket, params, rooms, users);
    }

    // checking if there is an active meeting with the roomID.
    const roomExists = Object.keys(rooms).find((id) => id === roomID);
    if (!roomExists) {
      return socket.emit("error", {
        error: "Meeting has not started yet, wait for some time",
      });
    }

    roomType = rooms[roomID].type;
    meetingID = rooms[roomID].meetingID;

    // guest user joining public meeting.
    if (userType === "guest" && roomType === "public") {
      console.log("\nrequesting to join a guest user to public meeting....");

      // registering as guest user.
      if (!userID) {
        const data = await createGuest();
        userID = data.userID;
        username = data.username;
        params.userID = data.userID;
        params.username = data.username;

        // send back the params so client can update on the client side for guest user.
        socket.emit("join-response", { params: params });
      }

      console.log(userID, username);
    }
    // guest user joining a private meeting
    else if (userType === "guest" && roomType === "private") {
      console.log("\n requesting to join a guest user to private meetings...");

      // creating a guest user and setting it to userID and username
      if (!userID) {
        const data = await createGuest();
        userID = data.userID;
        username = data.username;

        // send back the params so client can update on the client side for guest user.
        socket.emit("join-response", { params: params });
      }

      const response = await addGuestParticipant(userID, meetingID);
      if (response.status === "error") {
        throw new Error("Error when adding guest to participants table");
      }
    }
    // registered user joining a private meeting
    else if (userType === "registered" && roomType === "private") {
      console.log(
        "\nrequesting to join a registered user  to a private meeting..."
      );

      const response = await addParticipant(userID, meetingID);
      if (response.status === "error") {
        throw new Error("Internal server Error");
      }
    } else {
      console.log(
        "\nrequesting to join a registered user to a public meeting.... "
      );
    }

    // updating user object with the newly joined user.
    users[socket.id] = {
      roomID: roomID,
      userID: userID,
      username: username,
      role: "attendee",
      type: userType,
    };

    rooms[roomID].users.push(socket.id);
    console.log(username, "added to room:", roomID, "\n");
  } catch (error) {
    console.log(error);
    socket.emit("error", { error: error.message });
  }
};

const handleMessages = async (
  io: Server,
  socket: Socket,
  params: { message: string },
  rooms: object,
  users: object
) => {
  try {
    let response;
    const roomID = users[socket.id].roomID;
    const message = params.message;

    const roomType = rooms[roomID].type;
    const meetingID = rooms[roomID].meetingID;
    const userType = users[socket.id].type;
    const userID = users[socket.id].userID;

    console.log(roomType, userType, userID, meetingID);
    console.log(`"` + message + '"' + " from user" + users[socket.id].userID);

    if (roomType === "public" && userType === "guest") {
      response = await saveGstToPublic(userID, meetingID, message);
    } else if (roomType === "public" && userType === "registered") {
      response = await saveRegToPublic(userID, meetingID, message);
    } else if (roomType === "private" && userType === "registerd") {
      response = await saveRegToPrivate(userID, meetingID, message);
    } else if (roomType === "private" && userType === "guest") {
      response = await saveGstToPrivate(userID, meetingID, message);
    }

    if (response.status === "error") {
      console.log(response.error);
      throw new Error("unable to send message");
    }

    const otherUsers = rooms[roomID].users; // selecting all users from your room

    // sends message to other users in the particular room
    otherUsers.forEach((user: string) => {
      if (user !== socket.id) {
        console.log(user, otherUsers);
        io.to(user).emit("msg-to-client", message);
      }
    });
  } catch (error) {
    console.log(error);

    socket.emit("error", { error: error });
  }
};

export { handleJoin, handleMessages };
