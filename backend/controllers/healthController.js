const healthService = require("../services/healthService");

const getHealth = (req, res, next) => {
    try {
        const result =
            healthService.getHealthStatus();

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHealth,
};