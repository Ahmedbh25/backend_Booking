import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";

// puts new Express application inside the app variable.
const app = express();

//The dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
dotenv.config();

const PORT = process.env.PORT || 8000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongodb !");
    } catch (error) {
        throw error;
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

// middlewares :
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/*
app.use('/api/hotels');
app.use('/api/users');
app.use('/api/rooms');
*/

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

// the function that starts a port and host, in our case the localhost for the connections to listen to incoming requests from a client.
app.listen(PORT, () => {
    connect();
    console.log(`Connected to backend on port : ${PORT}.`);
});

/*
ahmed.benhamouda.98webdev@gmail.com
ahmedbenhamouda98webdev
hBUaeL4rljQ8zA0O
*/