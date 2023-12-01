import { Socket } from "socket.io";
import { createGuest } from "./guestController";
import { addParticipant } from "./userController";
import { addGuestParticipant } from "./guestController";

export interface joinParameters {
  userID: string | null;
  username: string | null;
  roomID: string;
  userType: string;
}

const handleJoin = async (
  socket: Socket,
  params: joinParameters,
  rooms: {},
  users: {}
) => {
  try {
    let { userID, userType, roomID, username } = params;

    // checking if there is an active meeting with the roomID.
    const roomExists = Object.keys(rooms).find((id) => id === roomID);
    if (!roomExists) {
      return socket.emit("error", {
        error: "Meeting has not started yet, wait for some time",
      });
    }

    const roomType = rooms[roomID].type;
    const meetingID = rooms[roomID].meetingID;

    // guest user joining public meeting.
    if (userType === "guest" && roomType === "public") {
      console.log("\nrequesting to join a guest user to public meeting....");

      // registering as guest user.
      if (!userID) {
        const data = await createGuest();
        userID = data.userID;
        username = data.username;

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

    console.log(rooms, users);
  } catch (error) {
    console.log(error);
    socket.emit("error", { error: error.message });
  }
};

export { handleJoin };
