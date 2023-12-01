import { Socket } from "socket.io";
import { createGuest } from "./guestController";

interface joinParameters {
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
  let { userID, userType, roomID, username } = params;

  const roomExists = Object.keys(rooms).find((id) => id === roomID);
  if (!roomExists) {
    return socket.emit("error", {
      error: "Meeting has not started yet, wait for some time",
    });
  }

  const roomType = rooms[roomID].type;

  // guest user joining public meeting.
  if (userType === "guest" && roomType === "public") {
    console.log("\nrequesting to join a guest user to public meeting....");

    const data = await createGuest();
    userID = data.userID;
    username = data.username;

    // send back the params so client can update on the client side for guest user.
    socket.emit("join-response", { params: params });
    console.log(userID, username);

    users[socket.id] = {
      roomID: roomID,
      userID: userID,
      username: username,
      role: "attendee",
      type: userType,
    };

    console.log(
      "generated a guest_id and username and added to users object...."
    );
    rooms[roomID].users.push(socket.id);
    console.log(username, "added to room:", roomID, "\n");
  }
  // guest user joining a private meeting
  else if (userType === "guest" && roomType === "private") {
  }
  // register user joining a private meeting
  else if (userType === "registered" && roomType === "private") {
  } else {
    console.log(
      "\nrequesting to join a registered user to a public meeting.... "
    );
    users[socket.id] = {
      roomID: roomID,
      userID: userID,
      username: username,
      role: "attendee",
      type: userType,
    };
  }

  console.log(rooms, users);
};

export { handleJoin };
