require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(
                `Backend appEduai đang chạy tại http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Không thể khởi động server:",
            error.message
        );

        process.exit(1);
    }
};

startServer();