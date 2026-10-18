const { normalizeText } = require("./chatContext");

/**
 * Gemini sometimes returns Markdown, while the Chat UI displays plain Text.
 * Remove presentation markers without changing ordinary * operators in math.
 */
const cleanChatAnswer = (value = "") => {
    return normalizeText(value)
        // Remove Markdown code-fence markers, not the code itself.
        .replace(/^[ \t]*`{3,}[^\n]*$/gm, "")
        // Remove Markdown separators and heading markers.
        .replace(/^[ \t]*(?:[-_*][ \t]*){3,}$/gm, "")
        .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
        // Convert Markdown list items to a native-looking bullet.
        .replace(/^[ \t]*[-*+][ \t]+/gm, "• ")
        // Strip bold / italic markers while keeping the text.
        .replace(/\*\*\*([^*\n]+)\*\*\*/g, "$1")
        .replace(/\*\*([^*\n]+)\*\*/g, "$1")
        .replace(/__([^_\n]+)__/g, "$1")
        .replace(/(?<![\p{L}\p{N}])\*([^\s*\n](?:[^*\n]*?[^\s*\n])?)\*(?![\p{L}\p{N}])/gu, "$1")
        .replace(/(?<![\p{L}\p{N}])_([^\s_\n](?:[^_\n]*?[^\s_\n])?)_(?![\p{L}\p{N}])/gu, "$1")
        .replace(/`([^`\n]+)`/g, "$1")
        .replace(/[ \t]+$/gm, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

module.exports = { cleanChatAnswer };
