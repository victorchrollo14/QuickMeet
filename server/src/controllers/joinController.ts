import { Socket } from "socket.io";
import { createGuest } from "../DatabaseAPI/user.api";
import {
  addParticipant,
  checkGuestParticipant,
  checkParticipant,
} from "../DatabaseAPI/participant.api";
import { addGuestParticipant } from "../DatabaseAPI/participant.api";
import { logger } from "..";
import { ValidateParams } from "../utils/validater";
import { getMeet, updateMeetStart } from "../DatabaseAPI/meeting.api";
import {
  getGuestMeet,
  updateGstMeetStart,
} from "../DatabaseAPI/gstmeeting.api";

export interface joinParameters {
  userID: string;
  username: string;
  meetingID: string;
  roomID: string;
  userType: "registered" | "guest";
  role: "host" | "attendee";
  roomType: "private" | "public";
}

const joinHost = async (
  socket: Socket,
  params: joinParameters,
  rooms: Object,
  users: Object
) => {
  try {
    let { roomID, userID, username, role, userType, roomType, meetingID } =
      params;

    if (roomType === "private") {
      const meetData = await getMeet(roomID);
      if (meetData.user_id != userID)
        return socket.emit("error", { error: "User is not the host" });

      if (meetData.status !== "active") {
        await updateMeetStart(userID, roomID, "active");
        console.log(`updated meeting status to active, by host ${userID}`);
      }
    } else if (roomType === "public") {
      const meetData = await getGuestMeet(roomID);
      if (meetData.guest_id != userID)
        return socket.emit("error", { error: "User is not the host" });

      if (meetData.status !== "active") {
        await updateGstMeetStart(userID, roomID, "active");
        console.log(`updated meeting status to active, by host ${userID}`);
      }
    }

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
  } catch (err) {
    console.log(err);
    socket.emit("error", err.message);
  }
};

const joinMeet = async (
  socket: Socket,
  params: joinParameters,
  rooms: Object,
  users: Object
) => {
  try {
    const isValidParam = ValidateParams(params);
    if (!isValidParam.isValid) {
      return socket.emit("error", { error: isValidParam.error });
    }

    let { userID, userType, roomID, username, roomType, meetingID, role } =
      params;
    console.log("params", params);

    if (role === "host") {
      joinHost(socket, params, rooms, users);
      return;
    }

    // checking if there is an active meeting with the roomID.
    const roomExists = Object.keys(rooms).find((id) => id === roomID);
    if (!roomExists) {
      return socket.emit("error", {
        error: "Meeting has not started yet, wait for some time",
      });
    }

    // guest user joining public meeting.
    if (userType === "guest" && roomType === "public") {
      console.log("\nrequesting to join a guest user to public meeting....");
    }
    // guest user joining a private meeting
    else if (userType === "guest" && roomType === "private") {
      console.log("\n requesting to join a guest user to private meetings...");

      const participant = await checkGuestParticipant(userID, meetingID);
      if (!participant) {
        await addGuestParticipant(userID, meetingID);
        console.log("guest added as participant in:" + roomID);
      }
    }
    // registered user joining a private meeting
    else if (userType === "registered" && roomType === "private") {
      console.log(
        "\nrequesting to join a registered user  to a private meeting..."
      );
      const participant = await checkParticipant(userID, meetingID);
      if (!participant) {
        await addParticipant(userID, meetingID, "attendee");
        console.log(`added ${username} as participant in room: ${roomID}`);
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
    console.log(rooms, users);
  } catch (error) {
    console.log(error);
    socket.emit("error", { error: error.message });
  }
};

export { joinMeet };
