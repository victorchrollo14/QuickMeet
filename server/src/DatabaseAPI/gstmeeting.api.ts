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

export { createGuestMeeting };
