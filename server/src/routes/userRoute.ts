import { Router } from "express";
import { googleAuth } from "../services/googleAuth";
import { verifyTokenMiddleWare } from "../middleware/auth";
import { getMe } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/login", googleAuth);
userRouter.get("/me", verifyTokenMiddleWare, getMe);

export { userRouter };
