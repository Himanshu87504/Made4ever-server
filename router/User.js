import express from "express";
import {
    signup,
    verifyUser,
    login,
    requestOtpLogin,
    verifyOtpLogin,
    forgotPasswordRequest,
    resetPassword,
    me,
} from "../Controller/User.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-signup", verifyUser);
router.post("/login", login);
router.post("/request-otp-login", requestOtpLogin);
router.post("/verify-otp-login", verifyOtpLogin);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password", resetPassword);
router.get("/me", isAuth, me);

export default router;
