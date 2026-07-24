import express from "express";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import interviewRouter from "./routes/interview.route.js";
import route from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/auth", route);
app.use("/api/v1/interview", interviewRouter);

// healthy Api
app.get('/', (req, res) => {
    res.status(200).json({ status: "success", message: "Server is healthy" });
});

// 404 handler — koi bhi undefined route hit hone par
// 404 handler — koi bhi undefined route hit hone par
app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);



export default app;