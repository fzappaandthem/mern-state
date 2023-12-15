import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

mongoose.connect(process.env.MONGO).then(console.log('conectado a mongoDB'))
    .catch((err)=>console.log(err));

const app = express();

app.use(express.json());


app.listen(3000, () => {
    console.log('Server corriendo en puerto 3000!!!');
});

//creación api route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);