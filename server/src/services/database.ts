import { Pool } from "pg";
import "dotenv/config";

const config = {
  user: "postgres",
  host: process.env.DB_HOST || "postgres_db",
  database: "quickmeet",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
};

console.log(config);

const pool = new Pool(config);

const connectDB = async () => {
  try {
    await pool.connect();
  } catch (error) {
    console.log(error);
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
