const express = require("express");
const cors = require("cors");

const documentRoutes = require("./routes/documentRoutes");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");

const {
    errorMiddleware,
} = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

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

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message:
            "API endpoint không tồn tại.",
    });
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;