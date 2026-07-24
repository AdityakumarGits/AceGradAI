import dotenv from 'dotenv';
dotenv.config();   // ✅ sabse pehle — kisi aur file import hone se pehle

import http from "http";
import connectDB from './config/db.js';
import app from "./app.js"; // Hamara express app engine import kiya

const port = process.env.PORT || 5000;

// Database connect karo
connectDB();

// HTTP Server setup (Jo kal ko WebSockets/Socket.io ke liye kaam aayega)
const server = http.createServer(app);

// Server Start Listen
server.listen(port, () => {
    console.log(`🚀 AceGrad Server booted and listening on port ${port}!`);
});