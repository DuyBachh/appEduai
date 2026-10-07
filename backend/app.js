const express = require("express");
const path = require("path");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const chatRoutes = require("./routes/chatRoutes");
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

// Static uploaded files
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// Routes
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

app.use(
    "/api/summaries",
    summaryRoutes
);

app.use(
    "/api/chat",
    chatRoutes
);

// 404
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message:
            "API endpoint không tồn tại.",
    });
});

// Global error middleware
app.use(errorMiddleware);

module.exports = app;