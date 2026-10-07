require("dotenv").config();

const {
    generateText,
} = require("./services/aiService");

const testAI = async () => {
    try {
        const result =
            await generateText({
                instructions:
                    "Trả lời ngắn gọn bằng tiếng Việt.",
                prompt:
                    "React Native là gì?",
            });

        console.log(
            "===== GEMINI RESPONSE ====="
        );

        console.log(result);
    } catch (error) {
        console.error(
            "Lỗi Gemini:",
            error.message
        );
    }
};

testAI();