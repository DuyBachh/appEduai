const express = require("express");
const path = require("path");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

const {
    errorMiddleware,
} = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// Cho phép truy cập các file đã upload
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// API Routes
app.use(
    "/api/health",
    healthRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/documents",
    documentRoutes
);

// 404 - API không tồn tại
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message:
            "API endpoint không tồn tại.",
    });
});

// Global Error Middleware
app.use(errorMiddleware);

module.exports = app;