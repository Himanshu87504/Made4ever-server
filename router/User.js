import express from "express";
import {
    signup,
    verifyUser,
    login,
    requestOtpLogin,
    verifyOtpLogin,
    forgotPasswordRequest,
    resetPassword,
} from "../Controller/User.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-signup", verifyUser);
router.post("/login", login);
router.post("/request-otp-login", requestOtpLogin);
router.post("/verify-otp-login", verifyOtpLogin);
router.post("/forgot-password", forgotPasswordRequest);
router.post("/reset-password", resetPassword);

export default router;
