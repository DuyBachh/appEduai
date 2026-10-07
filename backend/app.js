const express = require("express");
const cors = require("cors");
const path = require("path");

// ========================================
// ROUTES
// ========================================

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

// ========================================
// ERROR MIDDLEWARE
// ========================================

const errorMiddlewareModule =
    require("./middleware/errorMiddleware");

const errorMiddleware =
    typeof errorMiddlewareModule === "function"
        ? errorMiddlewareModule
        : errorMiddlewareModule.errorMiddleware ||
          errorMiddlewareModule.errorHandler;

// ========================================
// VALIDATE IMPORTS
// ========================================

const validateRouter = (
    name,
    router
) => {
    if (
        typeof router !== "function"
    ) {
        throw new TypeError(
            `${name} không phải Express Router/Middleware. Kiểm tra module.exports của file route.`
        );
    }
};

validateRouter(
    "healthRoutes",
    healthRoutes
);

validateRouter(
    "authRoutes",
    authRoutes
);

validateRouter(
    "documentRoutes",
    documentRoutes
);

validateRouter(
    "summaryRoutes",
    summaryRoutes
);

validateRouter(
    "chatRoutes",
    chatRoutes
);

validateRouter(
    "solverRoutes",
    solverRoutes
);

validateRouter(
    "ocrRoutes",
    ocrRoutes
);

if (
    typeof errorMiddleware !==
    "function"
) {
    throw new TypeError(
        "errorMiddleware không phải function."
    );
}

// ========================================
// APP
// ========================================

const app =
    express();

// ========================================
// CORS
// ========================================

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// ========================================
// BODY
// ========================================

app.use(
    express.json({
        limit: "10mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

// ========================================
// STATIC UPLOADS
// ========================================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);

// ========================================
// TEST ROOT
// ========================================

app.get(
    "/",
    (
        req,
        res
    ) => {
        res.status(200).json({
            success: true,

            message:
                "appEduai Backend đang hoạt động.",
        });
    }
);

// ========================================
// API ROUTES
// ========================================

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

// ========================================
// 404
// ========================================

app.use(
    (
        req,
        res
    ) => {
        res.status(404).json({
            success: false,

            message:
                `Không tìm thấy API: ${req.method} ${req.originalUrl}`,
        });
    }
);

// ========================================
// ERROR HANDLER
// ========================================

app.use(
    errorMiddleware
);

// ========================================
// EXPORT
// ========================================

module.exports =
    app;