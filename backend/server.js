import http from "http";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from "./app.js"; // Hamara express app engine import kiya

// 1. Sabse pehle environment variables load karo
dotenv.config();

const port = process.env.PORT || 5000;

// 2. Database connect karo
connectDB();

// 3. HTTP Server setup (Jo kal ko WebSockets/Socket.io ke liye kaam aayega)
const server = http.createServer(app);

// 4. Server Start Listen
server.listen(port, () => {
    console.log(`🚀 AceGrad Server booted and listening on port ${port}!`);
});