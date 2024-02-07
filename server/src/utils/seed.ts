import {
  roleType,
  statusType,
  createUsers,
  createGuest,
  createMessages,
  createMeet,
  createParticipant,
  createGuestMeet,
  createGuestMessages,
} from "./seedQuery";

import { connectDB, disconnectDB, pool } from "../services/database";

const creatTables = async () => {
  try {
    await connectDB();
    console.log("********    connected to database      *****");

    const role = await pool.query(roleType);
    console.log("role type created");

    const status = await pool.query(statusType);
    console.log("status type created");

    const users = await pool.query(createUsers);
    console.log("created users table...");

    const guests = await pool.query(createGuest);
    console.log("created Guest users");

    const meet = await pool.query(createMeet);
    console.log("created Meet Table");

    const messages = await pool.query(createMessages);
    console.log("created Messages Table");

    const participant = await pool.query(createParticipant);
    console.log("created participant Table");

    const guestMeet = await pool.query(createGuestMeet);
    console.log("created guest Meeting Table");

    const guestMessage = await pool.query(createGuestMessages);
    console.log("Created guest messages Table");

    await disconnectDB();
    console.log("\n ***** Disconnected from database *****");
  } catch (error) {
    console.log(error);
  }
};

creatTables();
