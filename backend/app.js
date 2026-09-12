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
app.use(
  cors({
    origin: process.env.CLIENT_URL,
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
  next(
    new AppError(`Route ${req.originalUrl} not found`, 404)
  );
});

// Global error handler
app.use(globalErrorHandler);

export default app;