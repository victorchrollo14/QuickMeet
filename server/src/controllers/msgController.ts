import { Server, Socket } from "socket.io";
import {
  getAllMessagesFromPrivate,
  getAllMessagesFromPublic,
  saveGstToPrivate,
  saveGstToPublic,
  saveRegToPrivate,
  saveRegToPublic,
} from "../DatabaseAPI/message.api";
import { getUser } from "../DatabaseAPI/user.api";

// pass
const broadCastMessage = async (
  io: Server,
  socket: Socket,
  params: { message: string },
  rooms: object,
  users: object,
  callback: CallableFunction
) => {
  try {
    let response, user;
    const roomID = users[socket.id].roomID;
    const message = params.message;

    const roomType = rooms[roomID].type;
    const meetingID = rooms[roomID].meetingID;
    const userType = users[socket.id].type;
    const userID = users[socket.id].userID;
    const username = users[socket.id].username;

    console.log(roomType, userType, userID, meetingID);
    console.log(`"` + message + '"' + " from user" + users[socket.id].userID);

    if (roomType === "public" && userType === "guest") {
      console.log("saving the guest user message in public meeting....");
      response = await saveGstToPublic(userID, meetingID, message);
    } else if (roomType === "public" && userType === "registered") {
      console.log("saving the registered  user message in public meeting....");
      response = await saveRegToPublic(userID, meetingID, message);
      user = await getUser(userID);
    } else if (roomType === "private" && userType === "registered") {
      console.log("saving the registered  user message in private meeting....");
      response = await saveRegToPrivate(userID, meetingID, message);
      user = await getUser(userID);
    } else if (roomType === "private" && userType === "guest") {
      console.log("saving the guest  user message in private meeting....");
      response = await saveGstToPrivate(userID, meetingID, message);
    }

    const { time } = response;
    let profilePic: string;
    if (user) profilePic = user.profile_pic;
    console.log(profilePic);

    if (response?.status === "error") {
      console.log(response.error);
      return socket.emit("error", "Unable to send message");
    }

    const otherUsers = rooms[roomID].users; // selecting all users from your room

    // sends message to other users in the particular room
    otherUsers.forEach((user: string) => {
      if (user !== socket.id) {
        console.log(user, otherUsers);
        io.to(user).emit("msg-to-client", {
          message,
          profilePic,
          userID,
          username,
          time,
        });
      }
    });

    callback({ status: "ok" });
  } catch (err) {
    console.log(err);
    socket.emit("error", err.message);
  }
};

// pass
const getAllMessages = async (
  socket: Socket,
  params: {
    meetingID: string;
    roomType: string;
    userID: string;
    userType: string;
  }
) => {
  try {
    let data;
    const { meetingID, roomType, userID, userType } = params;
    console.log(`meetingID: ${meetingID}`);
    const roomTypeVal = ["public", "private"];

    if (!meetingID || !roomTypeVal.includes(roomType)) {
      return socket.emit("error", {
        error:
          "You have passed some invalid parameters, your meetingID is either null or wrong roomType",
      });
    }

    if (roomType === "private") {
      data = await getAllMessagesFromPrivate(meetingID);
      // console.log(data);
    } else if (roomType === "public") {
      data = await getAllMessagesFromPublic(meetingID);
      // console.log(data);
    }

    // sorting the messages
    const messages = data.map((item) => {
      const newTime = new Date(item.time);
      return { ...item, time: newTime };
    });
    messages.sort((a, b) => {
      return a.time - b.time;
    });

    socket.emit("all-messages", messages);
  } catch (err) {
    console.log(err);
    socket.emit("error", err.message);
  }
};

export { broadCastMessage, getAllMessages };
