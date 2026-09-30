const express = require("express");

const {
    register,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
} = require("../controllers/authController");

const {
    authMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/reset-password",
    resetPassword
);

router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

module.exports = router;