import { pool } from "../services/database";

const createGuest = async () => {
  try {
    const query = `INSERT INTO guests DEFAULT VALUES RETURNING guest_id, username`;
    const guestUser = (await pool.query(query)).rows[0];

    console.log(
      `created a new guest user and got guest_id: ${guestUser.guest_id}`
    );

    return guestUser;
  } catch (err) {
    throw new Error(err);
  }
};

const getUser = async (userID: string) => {
  try {
    const userQuery = `SELECT * FROM users WHERE user_id=$1`;
    const user = (await pool.query(userQuery, [userID])).rows[0];

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

export { createGuest, getUser };
