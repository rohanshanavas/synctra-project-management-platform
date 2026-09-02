import cors from "cors";
import express from "express";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(morgan("dev"));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Synctra API",
    });
});

app.use("/api-v1", routes);

// Error middleware
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        message: "Internal Server Error",
    });
});

// API not found middleware
app.use((req, res, next) => {
    console.log(`API not found: ${req.originalUrl}`);
    res.status(404).json({
        message: "API not found",
    });
});

export default app;