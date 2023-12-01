import { pool } from "../services/database";

const createGuest = async () => {
  try {
    const query = `INSERT INTO guests DEFAULT VALUES RETURNING guest_id, username`;
    const guestUser = await pool.query(query);
    if (guestUser.rowCount !== 1) {
      throw new Error("Error while creating guest user");
    }

    const guest_id = guestUser.rows[0].guest_id;
    const username = guestUser.rows[0].username;
    console.log(`created a new guest user and got guest_id: ${guest_id}`);

    return { userID: guest_id, username: username };
  } catch (error) {
    console.log(error);
  }
};

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

export { createGuest, addGuestParticipant };
