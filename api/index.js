import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO).then(console.log('conectado a mongoDB'))
    .catch((err)=>console.log(err));

const app = express();



app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server corriendo en puerto 3000!!!');
});

//creación api route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        succces: false,
        statusCode: statusCode,
        message: message,

    });
});