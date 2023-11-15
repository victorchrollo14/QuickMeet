import { Router } from "express";
import { googleAuth } from "../services/googleAuth";
import { verifyToken } from "../middleware/auth";
import { getMe } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/login", googleAuth);
userRouter.get("/me", verifyToken, getMe);

export { userRouter };
