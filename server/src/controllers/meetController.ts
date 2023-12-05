import { Request, Response } from "express";
import { logger } from "../index.js";
import ShortUniqueId from "short-unique-id";
import { pool } from "../services/database.js";

const generateRoom = () => {
  const { randomUUID } = new ShortUniqueId({ length: 12 });
  const roomID = randomUUID();
  return roomID;
};

const createRegMeet = async (userID: string, roomID: string) => {
  // create a new meet in meetings table with status as initiated.
  const query = `INSERT INTO meetings(user_id, room_id, status) VALUES($1, $2, $3) RETURNING meeting_id`;
  const createMeet = await pool.query(query, [userID, roomID, "initiated"]);

  if (createMeet.rowCount !== 1) {
    throw new Error("Failed to create a meet");
  }
  console.log(`${createMeet.rowCount} meeting added`);

  const meeting_id = createMeet.rows[0].meeting_id;
  console.log(`Got back the newly created meet_id: ${meeting_id}`);

  const query1 = `INSERT INTO participants(user_id, meeting_id, role) VALUES($1, $2, $3)`;
  const participant = await pool.query(query1, [userID, meeting_id, "host"]);

  if (participant.rowCount !== 1) {
    throw new Error("Failed to add user as host");
  }
  console.log(`${participant.rowCount} participant added as host`);

  return {
    role: "host",
    roomType: "private",
    meetingID: meeting_id,
    roomID: roomID,
    message: `created a meet and added user has host`,
  };
};

const createGuestMeet = async (roomID: string) => {
  const query = `INSERT INTO guests DEFAULT VALUES RETURNING guest_id`;
  const guestUser = await pool.query(query);
  if (guestUser.rowCount !== 1) {
    throw new Error("Error while creating guest user");
  }

  const guest_id = guestUser.rows[0].guest_id;
  console.log(`created a new guest user and got guest_id: ${guest_id}`);

  const query1 = `INSERT INTO guest_meetings(guest_id, room_id, status) VALUES($1, $2, $3) RETURNING meeting_id`;
  const guestMeet = await pool.query(query1, [guest_id, roomID, "initiated"]);
  if (guestMeet.rowCount !== 1) {
    throw new Error("Error while creating a guest meeting");
  }
  const meeting_id = guestMeet.rows[0].meeting_id;
  console.log(`${guestMeet.rowCount} guest Meet created`);

  return {
    role: "host",
    roomType: "public",
    meetingID: meeting_id,
    userID: guest_id,
    roomID: roomID,
    message: "created a guest meeting successfully",
  };
};

const createMeet = async (req: Request, res: Response) => {
  try {
    const { userID } = req.body;
    // generate roomID.
    const roomID = generateRoom();
    console.log(roomID, "is generated");

    // if user is registered
    if (req.headers.authorization) {
      const data = await createRegMeet(userID, roomID);
      return res.status(200).json(data);
    }

    // if user is guest
    // add them to guest table, then create a meet record in guest meetings table
    // return guest_id and roomID
    const data = await createGuestMeet(roomID);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
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
      const status = await (
        await pool.query(statusQuery, queryParams)
      ).rows[0].status;

      console.log(status);

      if (status === "active") {
        console.log(
          "The meeting is already active, seems like the host got disconnected and connected..."
        );
        return { status: "ok" };
      }

      const query = `UPDATE meetings SET start_time=CURRENT_TIMESTAMP, status='active' WHERE user_id=$1 AND room_id=$2 AND meeting_id=$3`;
      const updateMeet = await pool.query(query, queryParams);
      if (updateMeet.rowCount !== 1) {
        console.log("Error occured while changing meet status to active....\n");
        return { status: "error" };
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
      console.log("Error occured while changing meet status to active\n");
      return { status: "error" };
    }

    console.log("updated guest_meeting start time and status to active...\n");
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export { createMeet, startMeet };
