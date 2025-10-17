import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./Db/database.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// Allowed origins array with only frontend URL from environment
const allowedOrigins = [
    process.env.FRONTEND_URL
];

// CORS options to check origin dynamically
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (!allowedOrigins.includes(origin)) {
            console.log("Blocked CORS request from:", origin);
            return callback(new Error("Not allowed by CORS"));
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

// Enable CORS with the options
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
    console.log("Hello, I am Himanshu");
    res.send("Hello, it is working!");
});

// Import and use your user routes
import Userrouter from "./router/User.js";
app.use("/api", Userrouter);

// Start the server and connect to database
app.listen(5001, () => {
    console.log(`Server is running on port 5001`);
    connectdb();
});
