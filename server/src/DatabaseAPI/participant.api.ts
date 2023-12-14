import { pool } from "../services/database";

const addGuestParticipant = async (guestID: string, meetingID: string) => {
  try {
    const query = `INSERT INTO participants(guest_id, meeting_id, role) VALUES($1, $2, 'attendee') RETURNING *`;
    const participant = (await pool.query(query, [guestID, meetingID])).rows[0];

    return participant;
  } catch (error) {
    console.log(error);
  }
};

const checkGuestParticipant = async (guestID: string, meetingID: string) => {
  try {
    const query = `SELECT * from participants WHERE guest_id=$1 AND meeting_id=$2`;
    const participant = (await pool.query(query, [guestID, meetingID])).rows[0];

    return participant;
  } catch (err) {
    throw new Error(err);
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

    const query = `INSERT INTO participants(user_id, meeting_id, role) VALUES($1, $2, $3) RETURNING *`;
    const participant = await pool.query(query, [userID, meetingID, role]);

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
    const participant = (await pool.query(query, [userID, meetingID])).rows[0];

    return participant;
  } catch (err) {
    throw new Error(err);
  }
};

export {
  addGuestParticipant,
  addParticipant,
  checkParticipant,
  checkGuestParticipant,
};
