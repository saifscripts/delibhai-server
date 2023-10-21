const sendResponse = (res, status, message, data) => {
    const success = status >= 200 && status < 400;
    res.status(status).json({
        success,
        message,
        data: success ? data : undefined,
        error: success ? undefined : data,
    });
};

module.exports = sendResponse;
