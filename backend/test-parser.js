const path = require("path");

const {
    extractTextFromFile,
} = require("./services/extractTextService");

const test = async () => {
    try {
        const filePath = path.join(
            __dirname,
            "uploads",
            "1791366386755-738132751.pdf"
        );

        const text =
            await extractTextFromFile({
                filePath,
                fileType: "pdf",
            });

        console.log(
            "===== NỘI DUNG PDF ====="
        );

        console.log(text);
    } catch (error) {
        console.error(
            "Lỗi parser:",
            error.message
        );
    }
};

test();