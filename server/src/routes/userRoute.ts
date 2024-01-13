import { Router } from "express";
import { googleAuth } from "../services/googleAuth";
import { verifyTokenMiddleWare } from "../middleware/auth";
import { getMe } from "../controllers/userController";
import { handleGuest } from "../controllers/guestController";

const userRouter = Router();

userRouter.get("/login", googleAuth);
userRouter.get("/me", verifyTokenMiddleWare, getMe);
userRouter.get("/createGuest", handleGuest);

export { userRouter };
