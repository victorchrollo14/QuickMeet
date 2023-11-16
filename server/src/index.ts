import express from "express";
import "dotenv/config.js";
import { Pool } from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { userRouter } from "./routes/userRoute.js";

const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: [
    "https://quickmeet.tech/",
    "https://quickmeet-omega.vercel.app/",
    "http://localhost/5173",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// parse data from client
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", userRouter);

app.use("/get", (req, res) => {
  res.send("Ok!");
});

const config = {
  user: "postgres",
  host: "localhost",
  database: "quickmeet",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
};

const pool = new Pool(config);

const runServer = async () => {
  try {
    await pool.connect();
    console.log("connect to database");

    app.listen(PORT, () => {
      console.log(`Server running on :${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

runServer();

export { pool };
