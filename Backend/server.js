import "reflect-metadata";
import express from "express";
import connectDB from "./config/db.js";
import cors from 'cors'
import 'dotenv/config';
import cookieParser from "cookie-parser";
import TimeRouter from "./routes/timeRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;
const originAllowed = ['http://localhost:5173', 'https://time040.vercel.app'];

app.use(cors({
    origin: originAllowed,
    credentials: true
}));
await connectDB();
app.get('/', (req, res) => { res.send("Api is Working") });

app.use("/api/auth", authRouter);
app.use("/api", TimeRouter);


app.listen(port, () => console.log(`server running on port http://localhost:${port}`));
