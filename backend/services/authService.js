const { registerUser, loginUser } = require("./authAccountService");
const { getCurrentUser, updateProfile } = require("./authProfileService");
const { forgotPassword, resetPassword } = require("./authPasswordService");

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    updateProfile,
    forgotPassword,
    resetPassword,
};