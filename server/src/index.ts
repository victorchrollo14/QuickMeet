import express from "express";
import "dotenv/config.js";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer, Server } from "http";
import winston from "winston";

// Internal Imports
import { userRouter } from "./routes/userRoute.js";
import { meetRouter } from "./routes/meetRoutes.js";
import { connectDB } from "./services/database.js";
import initSocketServer from "./services/socket.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const PORT = process.env.PORT || 3000;
const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  // defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

const corsOptions = {
  origin: [
    "https://quickmeet.tech",
    "http://quickmeet.victorimmanuel.me",
    "https://quickmeet-omega.vercel.app",
    "http://localhost:5173",
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
app.use("/meet", meetRouter);

app.get("/", (req, res) => {
  res.status(200).send("Ok!");
});

// error handler middleware
app.use(notFound);
app.use(errorHandler);

const server: Server = createServer(app);
const io = initSocketServer(server);

const runServer = async () => {
  try {
    await connectDB();
    console.log("connect to the database");

    server.listen(PORT, () => {
      console.log(`Server running on :${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

runServer();

export { logger };
