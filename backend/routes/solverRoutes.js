const express = require("express");

const {
    solve,
} = require("../controllers/solverController");

const {
    authMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    solve
);

module.exports = router;