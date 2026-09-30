const getHealthStatus = () => {
    return {
        app: "appEduai",
        status: "running",
        message: "Backend appEduai đang hoạt động.",
        timestamp: new Date().toISOString(),
    };
};

module.exports = {
    getHealthStatus,
};