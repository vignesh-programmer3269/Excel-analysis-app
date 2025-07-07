const express = require("express");
const multer = require("multer");
const path = require("path");
const UploadedFile = require("../models/uploadedFile");

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (request, file, callback) => {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname}`;
    callback(null, fileName);
  },
});

// Filter only Excel files
const fileFilter = (request, file, callback) => {
  if (
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    callback(null, true);
  } else {
    callback(new Error("Only Excel files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Upload route
router.post("/excel", upload.single("file"), async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).json({ message: "No file uploaded" });
    }

    const savedFile = new UploadedFile({
      filename: request.file.filename,
      originalname: request.file.originalname,
      path: request.file.path,
      mimetype: request.file.mimetype,
      size: request.file.size,
    });

    await savedFile.save();

    response.json({
      message: "File uploaded and saved to DB",
      file: savedFile,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
