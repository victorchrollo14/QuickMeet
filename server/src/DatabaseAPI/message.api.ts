import { pool } from "../services/database";

const errorResponse = {
  status: "error",
  error: "you might have entered wrong user_id or meeting_id",
};

const getAllMessagesFromPrivate = async (meetingID: string) => {
  console.log("get all messages meetingID", meetingID);
  const query = `SELECT * FROM messages WHERE meeting_id=$1`;
  const messages = (await pool.query(query, [meetingID])).rows;
  // console.log(messages,query)
  return messages;
};

const getAllMessagesFromPublic = async (meetingID: string) => {
  console.log("get all messages meetingID", meetingID);
  const query = `SELECT * FROM guest_messages WHERE meeting_id=$1`;
  const messages = (await pool.query(query, [meetingID])).rows;
  // console.log(messages)
  return messages;
};

const saveRegToPrivate = async (
  userID: string,
  meetingID: string,
  message: string
) => {
  try {
    if (userID == null || meetingID == null) {
      throw new Error(
        "userID or meetingID seems to be null, You can't pass a null value to it"
      );
    }

    const query = `INSERT INTO messages(user_id, meeting_id, content) VALUES($1, $2, $3)`;
    const insertMessage = await pool.query(query, [userID, meetingID, message]);

    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to save Message for some reason");
    }

    return { status: "ok" };
  } catch (err) {
    throw new Error(err);
  }
};

const saveGstToPrivate = async (
  guestID: string,
  meetingID: string,
  message: string
) => {
  try {
    if (guestID == null || meetingID == null) {
      throw new Error(
        "userID or meetingID seems to be null, You can't pass a null value to it"
      );
    }
    const query = `INSERT INTO messages(guest_id, meeting_id, content) VALUES($1, $2, $3)`;
    const insertMessage = await pool.query(query, [
      guestID,
      meetingID,
      message,
    ]);

    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to add message to database");
    }

    return { status: "ok" };
  } catch (err) {
    throw new Error(err);
  }
};

// pass
const saveRegToPublic = async (
  userID: string,
  meetingID: string,
  message: string
) => {
  try {
    if (userID == null || meetingID == null) {
      throw new Error(
        "userID or meetingID seems to be null, You can't pass a null value to it"
      );
    }

    const query = `INSERT INTO guest_messages(user_id, meeting_id, content) VALUES($1, $2, $3)`;
    const insertMessage = await pool.query(query, [userID, meetingID, message]);

    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to add message to database");
    }

    return { status: "ok" };
  } catch (err) {
    throw new Error(err);
  }
};

// pass
const saveGstToPublic = async (
  guestID: string,
  meetingID: string,
  message: string
) => {
  try {
    if (guestID == null || meetingID == null) {
      throw new Error(
        "userID or meetingID seems to be null, You can't pass a null value to it"
      );
    }

    const query = `INSERT INTO guest_messages(guest_id, meeting_id, content) VALUES($1, $2, $3)`;
    const insertMessage = await pool.query(query, [
      guestID,
      meetingID,
      message,
    ]);

    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to add message to database");
    }

    return { status: "ok" };
  } catch (error) {}
};

export {
  saveGstToPrivate,
  saveRegToPrivate,
  saveGstToPublic,
  saveRegToPublic,
  getAllMessagesFromPrivate,
  getAllMessagesFromPublic,
};
