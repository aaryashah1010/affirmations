import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
console.log("Loaded key:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const result = await model.generateContent("Hello! Write one short affirmation about confidence.");
console.log(result.response.text());
