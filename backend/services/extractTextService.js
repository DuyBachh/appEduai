const fs = require("fs");
const path = require("path");

const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const extractPdfText = async (filePath) => {
    const buffer = await fs.promises.readFile(
        filePath
    );

    const parser = new PDFParse({
        data: buffer,
    });

    try {
        const result =
            await parser.getText();

        return result.text.trim();
    } finally {
        await parser.destroy();
    }
};

const extractDocxText = async (
    filePath
) => {
    const result =
        await mammoth.extractRawText({
            path: filePath,
        });

    return result.value.trim();
};

const extractTxtText = async (
    filePath
) => {
    const text =
        await fs.promises.readFile(
            filePath,
            "utf8"
        );

    return text.trim();
};

const extractTextFromFile = async ({
    filePath,
    fileType,
}) => {
    if (!filePath) {
        const error = new Error(
            "Không tìm thấy đường dẫn file."
        );

        error.statusCode = 400;

        throw error;
    }

    const normalizedType =
        fileType
            .toLowerCase()
            .replace(".", "");

    if (normalizedType === "pdf") {
        return extractPdfText(filePath);
    }

    if (normalizedType === "docx") {
        return extractDocxText(filePath);
    }

    if (normalizedType === "txt") {
        return extractTxtText(filePath);
    }

    const error = new Error(
        "Định dạng file không được hỗ trợ."
    );

    error.statusCode = 400;

    throw error;
};

module.exports = {
    extractPdfText,
    extractDocxText,
    extractTxtText,
    extractTextFromFile,
};