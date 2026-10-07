const {
    solveQuestion,
} = require("../services/solverService");

const solve = async (
    req,
    res,
    next
) => {
    try {
        const {
            question,
        } = req.body;

        const result =
            await solveQuestion({
                question,
            });

        res.status(200).json({
            success: true,
            message:
                "Giải bài tập thành công.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    solve,
};