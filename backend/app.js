const express = require("express");
const path = require("path");
const cors = require("cors");

const healthRoutes =
    require("./routes/healthRoutes");

const authRoutes =
    require("./routes/authRoutes");

const documentRoutes =
    require("./routes/documentRoutes");

const summaryRoutes =
    require("./routes/summaryRoutes");

const chatRoutes =
    require("./routes/chatRoutes");

const solverRoutes =
    require("./routes/solverRoutes");

const ocrRoutes =
    require("./routes/ocrRoutes");

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
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
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

app.use(
    "/api/summaries",
    summaryRoutes
);

app.use(
    "/api/chat",
    chatRoutes
);

app.use(
    "/api/solver",
    solverRoutes
);

app.use(
    "/api/ocr",
    ocrRoutes
);

app.use((req, res) => {
    return res
        .status(404)
        .json({
            success: false,
            message:
                "API endpoint không tồn tại.",
        });
});

app.use(
    errorMiddleware
);

module.exports = app;