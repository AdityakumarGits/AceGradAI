import express from "express";
import cors from "cors";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import interviewRouter from "./routes/interview.route.js";
import router from "./routes/user.route.js";

const app = express();

// Body parser
app.use(express.json({ limit: "1mb" }));

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://www.acegrad.in",
  "https://acegrad.in",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "AceGrad AI backend is healthy",
  });
});

// Routes
app.use("/api/v1/auth", router);
app.use("/api/v1/interview", interviewRouter);

// 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;