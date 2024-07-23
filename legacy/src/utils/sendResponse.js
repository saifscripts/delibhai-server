const sendResponse = (res, resData) => {
    const { status, message, data, error, code } = resData;

    res.status(status).json({
        success: status >= 200 && status < 400,
        message,
        data,
        error,
        code,
    });
};

module.exports = sendResponse;
