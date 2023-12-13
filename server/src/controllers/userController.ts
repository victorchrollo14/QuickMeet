import { Request, Response } from "express";
import { pool } from "../services/database.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { AuthenticatedRequest } from "../middleware/auth";

interface data {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
  locale: string;
}

const login = async (req: Request, res: Response, data: data) => {
  try {
    const { name, picture, email, locale } = data;

    const query = `SELECT * FROM users WHERE email=$1`;
    const user = await pool.query(query, [email]);
    console.log(user.rowCount);

    // if user doesn't exist we register them.
    if (user.rowCount < 1) {
      const addUserQuery = `INSERT INTO users(username, email, profile_pic, locale) VALUES($1, $2, $3, $4)`;
      const registerUser = await pool.query(addUserQuery, [
        name,
        email,
        picture,
        locale,
      ]);

      if (registerUser.rowCount === 1) {
        console.log("user registered successfully");
      }
    }

    const payload = {
      email: email,
    };
    console.log(payload);

    // generate jwt token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    res.status(200).json({ message: "logged in successfully", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

// const addParticipant = async (userID: string, meetingID: string) => {
//   try {
//     const query1 = `SELECT user_id from participants WHERE user_id=$1 AND meeting_id=$2`;
//     const checkParticipant = await pool.query(query1, [userID, meetingID]);

//     if (checkParticipant.rowCount > 0) {
//       console.log(
//         "participant is already added, seems like a reconnection...."
//       );
//       return { status: "ok" };
//     }

//     const query = `INSERT INTO participants(user_id, meeting_id, role) VALUES($1, $2, 'attendee')`;
//     const addParticipant = await pool.query(query, [userID, meetingID]);
//     if (addParticipant.rowCount !== 1) {
//       console.log("Some error occured while updating participants table.");
//       return { status: "error" };
//     }

//     console.log(`added user:${userID} as a participant`);
//     return { status: "ok" };
//   } catch (error) {
//     console.log(error);
//   }
// };

const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = `SELECT * FROM users WHERE email=$1`;
    const user = await pool.query(query, [req.user.email]);
    console.log(user);

    res.status(200).json(user.rows[0]);

    // const query = `SELECT * FROM users WHERE em`
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

export { login, getMe };
