import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Check ki key load hui ya nahi
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY missing in environment variables!");
}

// Gemini Client initialized
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default ai;