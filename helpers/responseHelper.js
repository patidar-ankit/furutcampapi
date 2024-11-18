// responseHelper.js

const sendSuccessResponse = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

const sendErrorResponse = (res, error, message = 'Error', statusCode = 500) => {
    res.status(statusCode).json({
        status: 'error',
        message,
        error: error.message || error,
    });
};

export {
    sendSuccessResponse,
    sendErrorResponse,
};
