import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if the API key is being loaded
console.log("Gemini API Key:", API_KEY);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate the study plan
export async function generateStudyPlan(userInput) {
  try {
    // Select Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
    });

    // Prompt for Gemini
    const prompt = `
You are StudyFriendly AI.

You are an academic study coach for university students.

Your responsibilities are:

1. Analyze the student's study situation.
2. Suggest which task should be prioritized.
3. Create a daily study schedule.
4. Provide time management suggestions.
5. Give useful study tips.
6. Provide a short motivational message.

Keep your response simple, clear, and easy to understand.

Student Information:

${userInput}
`;

    // Send the prompt to Gemini
    const result = await model.generateContent(prompt);

    // Get Gemini's response
    const response = await result.response;

    // Return the generated text
    return response.text();

  } catch (error) {

    // Show the actual error in the browser console
    console.error("Gemini Error:", error);

    // Show the actual error message inside the app
    return `Gemini Error: ${error.message}`;
  }
}