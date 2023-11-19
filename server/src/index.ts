import express from "express";
import "dotenv/config.js";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer, Server } from "http";

// Internal Imports
import { userRouter } from "./routes/userRoute.js";
import { connectDB } from "./services/database.js";
import initSocketServer from "./services/socket.js";

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

const server: Server = createServer(app);
const io = initSocketServer(server);

const runServer = async () => {
  try {
    await connectDB();
    console.log("connect to database");

    server.listen(PORT, () => {
      console.log(`Server running on :${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

runServer();
