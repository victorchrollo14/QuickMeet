import { Pool } from "pg";
import "dotenv/config";

const config = {
  host: process.env.DB_HOST, // Neon DB hostname
  port: 5432, // Default Postgres port
  user: process.env.DB_USER, // Your Neon DB username
  password: process.env.DB_PASSWORD, // Your Neon DB password
  database: process.env.DB_NAME, // Your Neon database name
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
