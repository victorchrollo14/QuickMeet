"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config.js");
const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log(token);
        if (!token) {
            return res.status(401).json({ error: "Unauthorized User" });
        }
        if (token.startsWith("Bearer")) {
            token = token.slice(7, token.length).trimStart();
            console.log(token);
        }
        console.log(process.env.JWT_SECRET_KEY);
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        console.log(verified);
        console.log(req.user);
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map