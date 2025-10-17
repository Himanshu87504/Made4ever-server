import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./Db/database.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));



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
