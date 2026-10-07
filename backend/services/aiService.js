const {
    ai,
} = require("../config/ai");

const generateText = async ({
    prompt,
    instructions = "",
}) => {
    if (!prompt) {
        const error = new Error(
            "Prompt không được để trống."
        );

        error.statusCode = 400;

        throw error;
    }

    const response =
        await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
            config: instructions
                ? {
                      systemInstruction:
                          instructions,
                  }
                : undefined,
        });

    return response.text;
};

module.exports = {
    generateText,
};