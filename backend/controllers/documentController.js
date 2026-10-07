const documentService = require("../services/documentService");

const createDocument = async (
    req,
    res,
    next
) => {
    try {
        const {
            name,
            fileType,
            size,
            uri,
            subject,
            topic,
        } = req.body;

        if (!name || !fileType) {
            return res.status(400).json({
                success: false,
                message:
                    "Vui lòng cung cấp tên file và loại file.",
            });
        }

        const document =
            await documentService.createDocumentService({
                userId: req.user.userId,
                name,
                fileType,
                size,
                uri,
                subject,
                topic,
            });

        res.status(201).json({
            success: true,
            message:
                "Tạo tài liệu thành công.",
            data: document,
        });
    } catch (error) {
        next(error);
    }
};

const getDocuments = async (
    req,
    res,
    next
) => {
    try {
        const documents =
            await documentService.getDocuments(
                req.user.userId
            );

        res.status(200).json({
            success: true,
            message:
                "Lấy danh sách tài liệu thành công.",
            data: documents,
        });
    } catch (error) {
        next(error);
    }
};

const getDocumentById = async (
    req,
    res,
    next
) => {
    try {
        const document =
            await documentService.getDocumentById({
                userId: req.user.userId,
                documentId: req.params.id,
            });

        res.status(200).json({
            success: true,
            message:
                "Lấy tài liệu thành công.",
            data: document,
        });
    } catch (error) {
        next(error);
    }
};

const updateDocument = async (
    req,
    res,
    next
) => {
    try {
        const {
            name,
            subject,
            topic,
        } = req.body;

        if (
            name === undefined &&
            subject === undefined &&
            topic === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Không có dữ liệu cần cập nhật.",
            });
        }

        const document =
            await documentService.updateDocument({
                userId: req.user.userId,
                documentId: req.params.id,
                name,
                subject,
                topic,
            });

        res.status(200).json({
            success: true,
            message:
                "Cập nhật tài liệu thành công.",
            data: document,
        });
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (
    req,
    res,
    next
) => {
    try {
        const result =
            await documentService.deleteDocument({
                userId: req.user.userId,
                documentId: req.params.id,
            });

        res.status(200).json({
            success: true,
            message:
                "Xóa tài liệu thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const uploadDocument = async (
    req,
    res,
    next
) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const {
            subject,
            topic,
        } = req.body;

        const file =
            req.files &&
            req.files.length > 0
                ? req.files[0]
                : null;

        console.log(
            "FILE ĐƯỢC CHỌN:",
            file
        );

        const document =
            await documentService.uploadDocumentService({
                userId: req.user.userId,
                file,
                subject,
                topic,
            });

        res.status(201).json({
            success: true,
            message:
                "Upload tài liệu thành công.",
            data: document,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createDocument,
    uploadDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
};