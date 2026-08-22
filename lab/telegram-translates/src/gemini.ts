import { GoogleGenerativeAI } from "@google/generative-ai";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  
  const prompt = `Translate the following text to ${targetLanguage}. Provide ONLY the translation and nothing else.Text: ${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
