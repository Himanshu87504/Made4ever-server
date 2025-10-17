import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./Db/database.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
    "https://made4ever-server.onrender.com/",
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
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
