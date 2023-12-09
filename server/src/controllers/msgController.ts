import { pool } from "../services/database";

const errorResponse = {
  status: "error",
  error: "you might have entered wrong user_id or meeting_id",
};

const saveRegToPrivate = async (
  userID: string,
  meetingID: string,
  message: string
) => {
  const query = `INSERT INTO messages(user_id, meeting_id, content) VALUES($1, $2, $3)`;
  const insertMessage = await pool.query(query, [userID, meetingID, message]);

  if (insertMessage.rowCount !== 1) {
    return errorResponse;
  }

  return { status: "ok" };
};

const saveGstToPrivate = async (
  guestID: string,
  meetingID: string,
  message: string
) => {
  const query = `INSERT INTO messages(guest_id, meeting_id, content) VALUES($1, $2, $3)`;
  const insertMessage = await pool.query(query, [guestID, meetingID, message]);

  if (insertMessage.rowCount !== 1) {
    return errorResponse;
  }

  return { status: "ok" };
};

const saveRegToPublic = async (
  userID: string,
  meetingID: string,
  message: string
) => {
  const query = `INSERT INTO guest_messages(user_id, meeting_id, content) VALUES($1, $2, $3)`;
  const insertMessage = await pool.query(query, [userID, meetingID, message]);

  if (insertMessage.rowCount !== 1) {
    return errorResponse;
  }

  return { status: "ok" };
};

const saveGstToPublic = async (
  guestID: string,
  meetingID: string,
  message: string
) => {
  const query = `INSERT INTO guest_messages(guest_id, meeting_id, content) VALUES($1, $2, $3)`;
  const insertMessage = await pool.query(query, [guestID, meetingID, message]);

  if (insertMessage.rowCount !== 1) {
    return errorResponse;
  }

  return { status: "ok" };
};

export { saveGstToPrivate, saveRegToPrivate, saveGstToPublic, saveRegToPublic };
