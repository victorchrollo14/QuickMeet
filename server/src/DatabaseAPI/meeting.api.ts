import { pool } from "../services/database";

const createMeeting = async (userID: string, roomID: string) => {
  try {
    if (!roomID || !userID) {
      throw new Error(
        "roomID or userID is null, unable to process meet insert query"
      );
    }
    const query = `INSERT INTO meetings(user_id, room_id, status) VALUES($1, $2, $3) RETURNING *`;
    const meetingData = (await pool.query(query, [userID, roomID, "initiated"]))
      .rows[0];
    console.log(meetingData);

    return meetingData;
  } catch (err) {
    throw new Error(err);
  }
};

export { createMeeting };
