import { pool } from "../services/database";

const addGuestParticipant = async (guestID: string, meetingID: string) => {
  try {
    const query = `SELECT guest_id from participants WHERE guest_id=$1 AND meeting_id=$2`;
    const checkGuest = await pool.query(query, [guestID, meetingID]);

    if (checkGuest.rowCount > 0) {
      console.log(
        "Guest is already added as participant, might be a reconnection..."
      );
      return { status: "ok" };
    }

    const query1 = `INSERT INTO participants(guest_id, meeting_id, role) VALUES($1, $2, 'attendee')`;
    const addGuest = await pool.query(query1, [guestID, meetingID]);
    if (addGuest.rowCount !== 1) {
      console.log("some error occured while adding a guest participant");
      return { status: "error" };
    }

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

const addParticipant = async (
  userID: string,
  meetingID: string,
  role: "host" | "attendee"
) => {
  try {
    if (!userID || !meetingID) {
      throw new Error("userID or meetingID might be null");
    }

    const query1 = `INSERT INTO participants(user_id, meeting_id, role) VALUES($1, $2, $3) RETURNING *`;
    const participant = await pool.query(query1, [userID, meetingID, role]);

    return participant;
  } catch (err) {
    throw new Error(err);
  }
};

const checkParticipant = async (userID: string, meetingID: string) => {
  try {
    if (!userID || !meetingID) {
      throw new Error("userID or meetingID might be null");
    }
    const query = `SELECT * from participants WHERE user_id=$1 AND meeting_id=$2`;
    const participant = await pool.query(query, [userID, meetingID]);

    return participant;
  } catch (err) {
    throw new Error(err);
  }
};

export { addGuestParticipant, addParticipant, checkParticipant };
