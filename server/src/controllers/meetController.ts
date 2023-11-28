import { Request, Response } from "express";
import { logger } from "../index.js";
import ShortUniqueId from "short-unique-id";
import { pool } from "../services/database.js";

const createMeet = async (req: Request, res: Response) => {
  try {
    // generate roomID.
    const roomID = generateRoom();
    console.log(roomID, "is generated");

    // if user is registered
    if (req.headers.authorization) {
      const { user_id } = req.body;

      // create a new meet in meetings table with status as initiated.
      const query = `INSERT INTO meetings(user_id, room_id, status) VALUES($1, $2, $3) RETURNING meeting_id`;
      const createMeet = await pool.query(query, [
        user_id,
        roomID,
        "initiated",
      ]);

      if (createMeet.rowCount !== 1) {
        throw new Error("Failed to create a meet");
      }

      console.log(`${createMeet.rowCount} meeting added`);

      const meeting_id = createMeet.rows[0].meeting_id;
      console.log(`Got back the newly created meet_id: ${meeting_id}`);

      const query1 = `INSERT INTO participants(user_id, meeting_id, role) VALUES($1, $2, $3)`;
      const participant = await pool.query(query1, [
        user_id,
        meeting_id,
        "host",
      ]);
      if (participant.rowCount > 0) {
        console.log(`${participant.rowCount} participant added as host`);
        res.status(200).json({
          roomID: roomID,
          message: `created a meet and added user has host`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const generateRoom = () => {
  const { randomUUID } = new ShortUniqueId({ length: 12 });
  const roomID = randomUUID();
  return roomID;
};

export { createMeet };
