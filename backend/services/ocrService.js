const {
    ai,
} = require("../config/ai");

const {
    getOcrPrompt,
} = require("../prompts/ocrPrompts");

const extractTextFromImage =
    async ({
        file,
    }) => {
        if (!file) {
            const error =
                new Error(
                    "Vui lòng chọn ảnh để OCR."
                );

            error.statusCode = 400;

            throw error;
        }

        const base64Image =
            file.buffer.toString(
                "base64"
            );

        const prompt =
            getOcrPrompt();

        const response =
            await ai.models.generateContent({
                model:
                    "gemini-3.5-flash-lite",

                contents: [
                    {
                        text: prompt,
                    },
                    {
                        inlineData: {
                            mimeType:
                                file.mimetype,
                            data:
                                base64Image,
                        },
                    },
                ],
            });

        const extractedText =
            response.text
                ? response.text.trim()
                : "";

        if (!extractedText) {
            const error =
                new Error(
                    "Không nhận diện được văn bản trong ảnh."
                );

            error.statusCode = 422;

            throw error;
        }

        return {
            originalName:
                file.originalname,

            mimeType:
                file.mimetype,

            size:
                file.size,

            extractedText,
        };
    };

module.exports = {
    extractTextFromImage,
};