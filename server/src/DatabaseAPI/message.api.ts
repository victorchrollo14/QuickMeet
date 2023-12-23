import { pool } from "../services/database";

// pass
const getAllMessagesFromPrivate = async (meetingID: string) => {
  try {
    const query = `SELECT 
    message_id AS "messageID",
    CASE 
        WHEN user_id IS NOT NULL THEN user_id
        WHEN guest_id IS NOT NULL THEN guest_id
    END AS "userID",
    content AS message,
    CASE 
        WHEN user_id IS NOT NULL THEN (SELECT username FROM users WHERE users.user_id = messages.user_id)
        WHEN guest_id IS NOT NULL THEN (SELECT username FROM guests WHERE guests.guest_id = messages.guest_id)
    END AS username,
    message_time AS time
FROM messages
WHERE meeting_id = $1`;

    const messages = (await pool.query(query, [meetingID])).rows;
    console.log(messages);
    return messages;
  } catch (err) {
    throw new Error(err);
  }
};

// pass
const getAllMessagesFromPublic = async (meetingID: string) => {
  try {
    const query = `SELECT 
    message_id AS "messageID",
    CASE 
        WHEN user_id IS NOT NULL THEN user_id
        WHEN guest_id IS NOT NULL THEN guest_id
    END AS "userID",
    content AS message,
    CASE 
        WHEN user_id IS NOT NULL THEN (SELECT username FROM users WHERE users.user_id = guest_messages.user_id)
        WHEN guest_id IS NOT NULL THEN (SELECT username FROM guests WHERE guests.guest_id = guest_messages.guest_id)
    END AS username,
    message_time AS time
FROM guest_messages
WHERE meeting_id = $1`;
    const messages = (await pool.query(query, [meetingID])).rows;
    // console.log(messages)
    return messages;
  } catch (err) {
    throw new Error(err);
  }
};

//pass
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

    const query = `INSERT INTO messages(user_id, meeting_id, content) VALUES($1, $2, $3) RETURNING message_time AS time, message_id AS "messageID"`;
    const insertMessage = await pool.query(query, [userID, meetingID, message]);
    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to save Message for some reason");
    }

    const data = insertMessage.rows[0];
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

//pass
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
    const query = `INSERT INTO messages(guest_id, meeting_id, content) VALUES($1, $2, $3) RETURNING message_time AS time, message_id AS "messageID"`;
    const insertMessage = await pool.query(query, [
      guestID,
      meetingID,
      message,
    ]);
    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to add message to database");
    }
    const data = insertMessage.rows[0];
    return data;
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

    const query = `INSERT INTO guest_messages(user_id, meeting_id, content) VALUES($1, $2, $3) RETURNING message_time AS time, message_id AS "messageID"`;
    const insertMessage = await pool.query(query, [userID, meetingID, message]);
    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to add message to database");
    }

    const data = insertMessage.rows[0];
    return data;
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

    const query = `INSERT INTO guest_messages(guest_id, meeting_id, content) VALUES($1, $2, $3) RETURNING message_time AS time, message_id AS "messageID"`;
    const insertMessage = await pool.query(query, [
      guestID,
      meetingID,
      message,
    ]);

    if (insertMessage.rowCount !== 1) {
      throw new Error("Unable to add message to database");
    }

    const data = insertMessage.rows[0];
    return data;
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
