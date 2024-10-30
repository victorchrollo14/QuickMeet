import { Pool } from "pg";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const config = {
  host: "ep-late-snow-a5d7byfl.us-east-2.aws.neon.tech", // Neon DB hostname
  port: 5432, // Default Postgres port
  user: "neondb_owner", // Your Neon DB username
  password: "Di1olzGO8JkL", // Your Neon DB password
  database: "neondb", // Your Neon database name
  ssl: true,
};
console.log(config);

const pool = new Pool(config);

const connectDB = async () => {
  try {
  } catch (error) {
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await pool.end();
  } catch (error) {
    console.log(error);
  }
};

export { connectDB, disconnectDB, pool };
