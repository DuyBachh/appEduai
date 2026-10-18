const fs = require("node:fs/promises");
const path = require("node:path");

const UPLOAD_DIRECTORY = path.resolve(__dirname, "../uploads");

// Only the names created by uploadMiddleware's diskStorage are manageable.
// Do not follow arbitrary paths or links provided by clients.
const MANAGED_UPLOAD_URI = /^\/uploads\/([0-9]+-[0-9]+\.(?:pdf|docx|txt))$/i;

const resolveManagedUploadPath = (uri) => {
    if (typeof uri !== "string") {
        return null;
    }

    const match = MANAGED_UPLOAD_URI.exec(uri);
    if (!match) {
        return null;
    }

    const target = path.resolve(UPLOAD_DIRECTORY, match[1]);
    return path.dirname(target) === UPLOAD_DIRECTORY ? target : null;
};

const removeManagedUpload = async (uri, unlinkFile = fs.unlink) => {
    const filePath = resolveManagedUploadPath(uri);

    if (!filePath) {
        return "not-managed";
    }

    try {
        await unlinkFile(filePath);
        return "deleted";
    } catch (error) {
        if (error?.code === "ENOENT") {
            // A lost/previously removed upload does not block database cleanup.
            return "already-missing";
        }
        throw error;
    }
};

module.exports = { resolveManagedUploadPath, removeManagedUpload };
