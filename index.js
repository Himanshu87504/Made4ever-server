import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./Db/database.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// Allowed origins from environment variables
const allowedOrigins = [
    process.env.FRONTEND_URL, // Vercel frontend
    process.env.LOCAL_URL     // Local dev
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow Postman/server requests

        if (!allowedOrigins.includes(origin)) {
            console.log("Blocked CORS request from:", origin);
            return callback(new Error("Not allowed by CORS"), false);
        }

        return callback(null, true);
    },
    credentials: true
}));

app.get("/", (req, res) => {
    console.log("Hello, I am Himanshu");
    res.send("Hello, it is working!");
});

import Userrouter from "./router/User.js";
app.use("/api", Userrouter);

app.listen(5001, () => {
    console.log(`Server is running on port 5001`);
    connectdb();
});
