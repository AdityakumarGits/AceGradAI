import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const protect = async (req, res, next) => {
    try {
        // 1. Token nikalna cookies ya authorization header se
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return next(new AppError("Unauthorized - No token found", 401));
        }

        // 2. Token ko verify karna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. User ko find karna database mein (FIX: decoded.id use kiya hai)
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return next(new AppError("The user belonging to this token no longer exists.", 401));
        }

        // 4. User data ko request object mein attach karna aur gate kholna
        req.user = user;
        return next();

    } catch (error) {
        // Dynamic error taaki exact crash ka pata chale (e.g., TokenExpiredError)
        return next(error);
    }
};