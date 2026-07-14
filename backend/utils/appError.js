class AppError extends Error {
    constructor(message, statusCode) {
        // Parent Error class ka constructor execute kiya
        super(message);

        this.statusCode = statusCode;
        // Agar status 4xx hai toh 'fail', agar 5xx hai toh 'error'
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        
        // Isse check hota hai ki exception humne khud generate kiya hai (Operational Error)
        this.isOperational = true;

        // Pure stack trace ko capture kiya taaki debugging mein file path aur line number saaf dikhe
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;