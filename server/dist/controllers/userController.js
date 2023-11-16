"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = void 0;
const index_1 = require("../index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config.js");
const login = async (req, res, data) => {
    try {
        const { name, picture, email, locale } = data;
        const query = `SELECT * FROM users WHERE email=$1`;
        const user = await index_1.pool.query(query, [email]);
        console.log(user.rowCount);
        // if user doesn't exist we register them.
        if (user.rowCount < 1) {
            const addUserQuery = `INSERT INTO users(username, email, profile_pic, locale) VALUES($1, $2, $3, $4)`;
            const registerUser = await index_1.pool.query(addUserQuery, [
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
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "30d",
        });
        res.status(200).json({ message: "logged in successfully", token: token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const query = `SELECT * FROM users WHERE email=$1`;
        const user = await index_1.pool.query(query, [req.user.email]);
        console.log(user);
        res.status(200).json(user.rows[0]);
        // const query = `SELECT * FROM users WHERE em`
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=userController.js.map