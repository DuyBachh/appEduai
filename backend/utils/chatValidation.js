const { ObjectId } = require("mongodb");
const { createServiceError } = require("./serviceError");

// ========================================
// VALIDATE ID
// ========================================

const validateObjectId = (
    id,
    message =
        "ID không hợp lệ."
) => {
    if (
        !ObjectId.isValid(
            id
        )
    ) {
        throw createServiceError(
            message,
            400
        );
    }
};

module.exports = { validateObjectId };
