import jwt from "jsonwebtoken";
import User from "../Models/User.js";

export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization; // token directly from frontend
        console.log("Auth Header:", token);

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token
        const user = await User.findById(decoded.id); // use 'id' if you signed JWT with { id: user._id }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // attach user to request
        next();
    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
