"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const googleAuth_1 = require("../services/googleAuth");
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.get("/login", googleAuth_1.googleAuth);
userRouter.get("/me", auth_1.verifyToken, userController_1.getMe);
//# sourceMappingURL=userRoute.js.map