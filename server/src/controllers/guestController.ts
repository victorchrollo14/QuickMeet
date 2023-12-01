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

export { createGuest };
