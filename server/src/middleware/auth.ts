import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

export interface AuthenticatedRequest extends Request {
  user: any;
}

const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY) as any;
    req.user = verified;
    console.log(verified);

    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { verifyToken };
