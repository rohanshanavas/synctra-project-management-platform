import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(morgan("dev"));

// DB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log("DB connection error: ", err));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({
        "message": "Welcome to Synctra API",
    });
});

// Error middleware
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// API not found middleware
app.use((req, res, next) => {
    console.log(`API not found: ${req.originalUrl}`);
    res.status(404).json({ message: "API not found" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});