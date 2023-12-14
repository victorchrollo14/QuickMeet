import { Socket } from "socket.io";
import { getGuestMeet } from "../DatabaseAPI/gstmeeting.api";
import { getMeet } from "../DatabaseAPI/meeting.api";

interface roomParams {
  roomID: string;
  userID: string;
  userType: "guest" | "registered";
  username: string;
}

type roomType = "public" | "private";
type roleType = "host" | "attendee";

// pass
const getRoomData = async (socket: Socket, params: roomParams) => {
  try {
    let roomType: roomType;
    let meetingID: string;
    let role: roleType;

    const { roomID, userType, userID, username } = params;
    const userTypeValues = ["guest", "registered"];

    if (!roomID || !userType || !userTypeValues.includes(userType) || !userID) {
      return socket.emit("error", {
        error: "Invalid or Missing Data in Requests",
      });
    }

    const guestMeetData = await getGuestMeet(roomID);
    const meetData = await getMeet(roomID);

    if (!guestMeetData && !meetData)
      return socket.emit("error", { error: "Room Doesn't Exist!" });

    if (guestMeetData) {
      const { meeting_id, guest_id, status } = guestMeetData;
      if (status === "ended")
        return socket.emit("error", { error: "The meeting has already Ended" });

      roomType = "public";
      meetingID = meeting_id;
      // role = "attendee";

      role = userType === "guest" && userID == guest_id ? "host" : "attendee";
    } else if (meetData) {
      console.log("inside meetData");

      const { meeting_id, user_id, status } = meetData;
      if (status === "ended")
        return socket.emit("error", { error: "The Meeting Has Already Ended" });

      roomType = "private";
      meetingID = meeting_id;

      console.log(userID, user_id);
      role =
        userType === "registered" && userID == user_id ? "host" : "attendee";
    }

    const data = {
      roomID,
      userType,
      userID,
      username,
      roomType,
      meetingID,
      role,
    };
    console.log(data);
    return socket.emit("get-room", data);
  } catch (err) {
    socket.emit("error", err.message);
  }
};

export { getRoomData };
