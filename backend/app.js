const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const {
    errorMiddleware,
} = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint không tồn tại.",
    });
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;