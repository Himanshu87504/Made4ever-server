import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./Db/database.js";
import cors from "cors";

dotenv.config();

const app = express();



app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


app.get("/", (req, res) => {
    console.log("Hello, I am Himanshu");
    res.send("Hello, it is working!");
});


import Userrouter from "./router/User.js";
app.use("/api", Userrouter);


app.listen(5001, () => {
    console.log(`Server is running on port `);
    connectdb();
});
