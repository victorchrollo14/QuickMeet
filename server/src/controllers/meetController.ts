import { Response } from "express";
import ShortUniqueId from "short-unique-id";
import { pool } from "../services/database.js";
import { AuthenticatedRequest, verifyToken } from "../middleware/auth.js";
import { joinParameters } from "./joinController.js";
import { createMeeting } from "../DatabaseAPI/meeting.api.js";
import { createGuest, getUser } from "../DatabaseAPI/user.api.js";
import { addParticipant } from "../DatabaseAPI/participant.api.js";
import { createGuestMeeting } from "../DatabaseAPI/gstmeeting.api.js";

interface newJoinParams extends joinParameters {
  message: string;
}

const generateRoom = () => {
  const { randomUUID } = new ShortUniqueId({ length: 12 });
  const roomID = randomUUID();
  return roomID;
};

// pass
const createRegMeet = async (userID: string, roomID: string) => {
  // create a new meet in meetings table with status as initiated.
  const user = await getUser(userID);

  const meetingData = await createMeeting(userID, roomID);
  const meetingID = meetingData.meeting_id;
  console.log(`a new meeting added`);

  const addHost = await addParticipant(userID, meetingID, "host");
  console.log(`added ${user.username} has host to participant table`);

  const data: newJoinParams = {
    role: "host",
    roomType: "private",
    userType: "registered",
    userID: userID,
    username: user.username,
    meetingID: meetingID,
    roomID: roomID,
    message: `created a meet and added user has host`,
  };

  return data;
};

// pass
const createGuestMeet = async (roomID: string) => {
  const guestUser = await createGuest();
  const guestID = guestUser.guest_id;

  const guestMeet = await createGuestMeeting(guestID, roomID, "initiated");
  console.log("created a guest meeting");

  const data: newJoinParams = {
    role: "host",
    roomType: "public",
    username: guestUser.username,
    userType: "guest",
    meetingID: guestMeet.meeting_id,
    userID: guestID,
    roomID: roomID,
    message: "created a guest meeting successfully",
  };

  return data;
};

// pass
const createMeet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userID } = req.body;
    // generate roomID.
    const roomID = generateRoom();
    console.log(roomID, "is generated");

    // if user is registered
    if (req.headers.authorization) {
      const token = req.header("Authorization");
      await verifyToken(token);
      console.log("user is verified");

      const data = await createRegMeet(userID, roomID);
      return res.status(200).json(data);
    }

    const data = await createGuestMeet(roomID);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const startMeet = async (params: {
  userID: string;
  roomID: string;
  meetingID: string;
  roomType: string;
  role: string;
}) => {
  try {
    let { userID, roomID, meetingID, roomType } = params;

    if (roomType === "private") {
      console.log("\nstarting the meeting of a registered user...");

      // check if the meeting is already active, if yes then return status: ok;
      const queryParams = [userID, roomID, meetingID];
      console.log(queryParams);

      const statusQuery = `SELECT status FROM meetings WHERE user_id=$1 AND room_id=$2 AND meeting_id=$3`;
      const status = (await pool.query(statusQuery, queryParams)).rows[0]
        .status;

      if (status === "active") {
        console.log(
          "The meeting is already active, seems like the host got disconnected and connected..."
        );
        return { status: "ok" };
      }

      const query = `UPDATE meetings SET start_time=CURRENT_TIMESTAMP, status='active' WHERE user_id=$1 AND room_id=$2 AND meeting_id=$3`;
      const updateMeet = await pool.query(query, queryParams);
      if (updateMeet.rowCount !== 1) {
        console.log("invalid credentials");
        return { status: "error", error: "Invalid credentials" };
      }

      console.log("updated meeting start time and status to active....\n");
      return { status: "ok" };
    }

    // guest user
    console.log("\nstarting the meeting of guest user....");

    const queryParams = [userID, roomID, meetingID];
    console.log(queryParams);

    const statusQuery = `SELECT status from guest_meetings WHERE guest_id=$1 AND room_id=$2 AND meeting_id=$3`;
    const status = (await pool.query(statusQuery, queryParams)).rows[0].status;

    console.log(status);

    if (status === "active") {
      console.log(
        "The meeting is already active, seems like the host got disconnected and connected..."
      );
      return { status: "ok" };
    }

    const query = `UPDATE guest_meetings SET start_time=CURRENT_TIMESTAMP, status='active' WHERE guest_id=$1 AND room_id=$2 AND meeting_id=$3`;
    const updateMeet = await pool.query(query, queryParams);
    if (updateMeet.rowCount !== 1) {
      console.log("Invalid credentials\n");
      return { status: "error", error: "Invalid credentials" };
    }

    console.log("updated guest_meeting start time and status to active...\n");
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export { createMeet, startMeet };
