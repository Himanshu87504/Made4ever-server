import User from "../Models/User.js";
import { signupSchema, Loginvalidation } from "./validationSchemas.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../Mail/Mail.js";

// ====================== SIGNUP (STEP 1) ======================
export const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: errors });
        }

        const { name, username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const userData = { name, username, email, password: hashPassword };

        const otp = Math.floor(100000 + Math.random() * 900000);
        // await sendMail(email, "Verify otp", otp);
        alert("otp", otp);


        const activationToken = jwt.sign(
            { userData, otp },
            process.env.Activation_Secret,
            { expiresIn: "5m" }
        );

        res.status(200).json({
            message: "OTP sent to your email",
            activationToken,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ====================== VERIFY SIGNUP OTP (STEP 2) ======================
export const verifyUser = async (req, res) => {
    try {
        const { otp, activationToken } = req.body;

        const decoded = jwt.verify(activationToken, process.env.Activation_Secret);
        if (!decoded) {
            return res.status(400).json({ message: "OTP expired or invalid token" });
        }

        if (decoded.otp !== Number(otp)) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        const { name, username, email, password } = decoded.userData;

        const user = await User.create({ name, username, email, password });

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
            },
        });
    } catch (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ message: "OTP expired. Please register again." });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ====================== NORMAL LOGIN ======================
export const login = async (req, res) => {
    try {
        const { error } = Loginvalidation.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({ message: errors });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username: email }] });

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ====================== OTP LOGIN (REQUEST) ======================
export const requestOtpLogin = async (req, res) => {
    try {
        // const { error } = Loginvalidation.validate(req.body, { abortEarly: false });
        // if (error) {
        //     const errors = error.details.map((err) => err.message);
        //     return res.status(400).json({ message: errors });
        // }

        const { email } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username: email }] });
        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const loginToken = jwt.sign({ userId: user._id, otp }, process.env.Activation_Secret, {
            expiresIn: "5m",
        });

        // await sendMail(email, "otp-login", otp);
        alert("otp", otp);

        res.status(200).json({
            message: "OTP sent to your email (for now check console)",
            loginToken,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ====================== VERIFY OTP LOGIN ======================
export const verifyOtpLogin = async (req, res) => {
    try {
        const { otp, loginToken } = req.body;
        const decoded = jwt.verify(loginToken, process.env.Activation_Secret);

        if (!decoded) return res.status(400).json({ message: "OTP expired or invalid token" });
        if (decoded.otp !== Number(otp))
            return res.status(400).json({ message: "Incorrect OTP" });

        const authToken = jwt.sign({ id: decoded.userId }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({ message: "Login successful", token: authToken });
    } catch (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ message: "OTP expired. Please request again." });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ====================== FORGOT PASSWORD (STEP 1: Request OTP) ======================
export const forgotPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000);
        // await sendMail(email, "Forgot-password", otp);
        alert("otp", otp);
        const resetToken = jwt.sign({ userId: user._id, otp }, process.env.Activation_Secret, {
            expiresIn: "5m",
        });

        res.status(200).json({
            message: "OTP sent to your email",
            resetToken,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ====================== FORGOT PASSWORD (STEP 2: Verify OTP + Set New Password) ======================
export const resetPassword = async (req, res) => {
    try {
        const { otp, resetToken, newPassword } = req.body;
        if (!otp || !resetToken || !newPassword)
            return res
                .status(400)
                .json({ message: "OTP, reset token, and new password are required" });

        const decoded = jwt.verify(resetToken, process.env.Activation_Secret);

        if (!decoded) return res.status(400).json({ message: "Invalid or expired token" });
        if (decoded.otp !== Number(otp))
            return res.status(400).json({ message: "Incorrect OTP" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

        res.status(200).json({ message: "Password reset successful!" });
    } catch (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ message: "OTP expired. Please request again." });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
