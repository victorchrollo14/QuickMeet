"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
require("dotenv/config.js");
const pg_1 = require("pg");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoute_js_1 = require("./routes/userRoute.js");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// parse data from client
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/user", userRoute_js_1.userRouter);
const config = {
    user: "postgres",
    host: "localhost",
    database: "techtalk",
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
};
const pool = new pg_1.Pool(config);
exports.pool = pool;
const runServer = async () => {
    try {
        await pool.connect();
        console.log("connect to database");
        app.listen(PORT, () => {
            console.log(`Server running on :${PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
runServer();
//# sourceMappingURL=index.js.map