const {
    GoogleGenAI,
} = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error(
        "Thiếu GEMINI_API_KEY trong file .env."
    );
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

module.exports = {
    ai,
};