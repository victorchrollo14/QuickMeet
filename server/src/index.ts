import express from "express";
import "dotenv/config.js";
import { Pool } from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { createServer } from "http";

const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// parse data from client
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ok");
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
};

const pool = new Pool(config);

const runServer = async () => {
  try {
    await pool.connect();
    console.log("connect to database");

    server.listen(PORT, () => {
      console.log("socket io server running on 3000");
    });
  } catch (error) {
    console.log(error);
  }
};

let clients = {};
io.on("connection", (socket) => {
  console.log(`a user connected, ${socket.id}`);

  const clientID = socket.id;
  clients[clientID] = socket;

  socket.on("msg-from-client", (data) => {
    console.log(data);
    Object.keys(clients).forEach((client) => {
      if (client !== clientID) {
        io.emit("msg-from-server", data);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected, ${clientID}`);
    delete clients[clientID];
  });
});

runServer();

export { pool, io };
