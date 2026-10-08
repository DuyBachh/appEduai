require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(
                `Backend appEduai đang chạy tại port ${PORT}`
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