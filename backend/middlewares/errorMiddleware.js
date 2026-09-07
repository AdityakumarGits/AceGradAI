import multer from "multer";

const globalErrorHandler = (err, req, res, next) => {
  // Default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Multer errors
  if (err instanceof multer.MulterError) {
    err.statusCode = 400;
    err.status = "fail";

    if (err.code === "LIMIT_FILE_SIZE") {
      err.message = "File size is too large.";
    } else {
      err.message = err.message || "File upload failed.";
    }
  }

  if (err.message === "Only WebM audio is allowed") {
    err.statusCode = 400;
    err.status = "fail";
  }

  if (err.message === "Only PDF resume is allowed") {
    err.statusCode = 400;
    err.status = "fail";
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default globalErrorHandler;