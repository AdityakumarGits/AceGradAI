import multer from "multer";

const storage = multer.memoryStorage();

// Resume upload
export const resumeUpload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF resume is allowed"));
    }

    cb(null, true);
  },
});

// Interview audio upload
export const audioUpload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    const mime = file.mimetype?.split(";")[0];

    if (mime !== "audio/webm") {
      return cb(new Error("Only WebM audio is allowed"));
    }

    cb(null, true);
  },
});