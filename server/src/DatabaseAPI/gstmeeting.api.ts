import { pool } from "../services/database";

const createGuestMeeting = async (
  guestID: string,
  roomID: string,
  status: "initiated" | "active" | "ended"
) => {
  try {
    if (!guestID || !roomID) {
      throw new Error(
        "roomID or userID is null, unable to process meet insert query"
      );
    }

    const query = `INSERT INTO guest_meetings(guest_id, room_id, status) VALUES($1, $2, $3) RETURNING *`;
    const guestMeetData = (await pool.query(query, [guestID, roomID, status]))
      .rows[0];

    return guestMeetData;
  } catch (err) {
    throw new Error(err);
  }
};

const getGuestMeet = async (roomID: string) => {
  try {
    const query = `SELECT * FROM guest_meetings WHERE room_id=$1`;
    const data = (await pool.query(query, [roomID])).rows[0];

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

const updateGstMeetStart = async (
  guestID: string,
  roomID: string,
  status: string
) => {
  try {
    const query = `UPDATE guest_meetings SET start_time=CURRENT_TIMESTAMP, status=$1 WHERE guest_id=$2 AND room_id=$3 RETURNING *`;
    const update = (await pool.query(query, [status, guestID, roomID])).rows[0];
    return update;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export { createGuestMeeting, getGuestMeet, updateGstMeetStart };
