const SUPPORTED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
]);

export function getMimeTypeFromUri(uri = "") {
    const cleanUri = String(uri)
        .split("?")[0]
        .toLowerCase();

    if (cleanUri.endsWith(".png")) return "image/png";
    if (cleanUri.endsWith(".webp")) return "image/webp";
    if (cleanUri.endsWith(".heic")) return "image/heic";
    if (cleanUri.endsWith(".heif")) return "image/heif";

    return "image/jpeg";
}

export function getExtensionFromMimeType(mimeType) {
    switch (mimeType) {
        case "image/png":
            return "png";
        case "image/webp":
            return "webp";
        case "image/heic":
            return "heic";
        case "image/heif":
            return "heif";
        default:
            return "jpg";
    }
}

export function normalizeImageAsset(asset, prefix = "image") {
    if (!asset?.uri) {
        throw new Error("Không thể lấy hình ảnh.");
    }

    const mimeType =
        asset.mimeType || getMimeTypeFromUri(asset.uri);

    if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
        throw new Error("Định dạng ảnh không được hỗ trợ.");
    }

    const extension = getExtensionFromMimeType(mimeType);

    return {
        uri: asset.uri,
        name:
            asset.fileName ||
            `${prefix}-${Date.now()}.${extension}`,
        mimeType,
    };
}
