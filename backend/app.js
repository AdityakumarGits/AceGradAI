import express from "express";
const app = express()
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./middlewares/errorMiddleware.js"; 
import interviewRouter from "./routes/interview.route.js";

import route from "./routes/user.route.js";



app.use(express.json());
app.use(cors());


//routes
app.use("/api/v1/auth", route);
app.use("/api/v1/interview", interviewRouter);

//healthy Api
app.get('/', (req, res, next) => { 
    return next(new AppError("Congratulations bhai! AceGrad Global Error Pipeline is working flawlessly!", 400));
});
app.use(globalErrorHandler);
export default app;