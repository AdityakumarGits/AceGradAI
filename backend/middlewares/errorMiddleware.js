const globalErrorHandler = (err, req, res, next) => {
    // Fallback status codes agar backend par code define karna bhool gaye ho
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Corporate standard clean json response formatting
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Development mode mein debugging ke liye stack trace bhi bhej rahe hain
        stack: err.stack 
    });
};

export default globalErrorHandler;