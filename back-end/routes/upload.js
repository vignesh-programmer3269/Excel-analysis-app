const express = require("express");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");

const UploadedFile = require("../models/uploadedFile");
const ExcelData = require("../models/ExcelData");
const authMiddleware = require("../middleware/authMiddleware");

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
router.post(
  "/excel",
  authMiddleware,
  upload.single("file"),
  async (request, response) => {
    try {
      if (!request.file) {
        return response.status(400).json({ message: "No file uploaded" });
      }

      const savedFile = new UploadedFile({
        userId: request.user.id,
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
  }
);

// Parse Excel file route
router.get("/parse/:filename", authMiddleware, async (request, response) => {
  const filePath = `uploads/${request.params.filename}`;

  if (!fs.existsSync(filePath)) {
    return response.status(404).json({ error: "File not found" });
  }

  const fileRecord = await UploadedFile.findOne({
    filename: request.params.filename,
    userId: request.user.id,
  });

  if (!fileRecord) {
    return response
      .status(401)
      .json({ error: "Unauthorized: File not found for this user" });
  }

  try {
    const workbook = XLSX.readFile(filePath);

    if (!workbook.SheetNames.length) {
      return response.status(400).json({ error: "Excel file has no sheets" });
    }

    const sheetName = workbook.SheetNames[0]; // first sheet
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    response.json({
      message: "Excel data parsed successfully",
      sheetName,
      data: sheetData,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to parse Excel file" });
  }
});

// Delete temporary file route
router.delete("/temp/:filename", authMiddleware, (request, response) => {
  const filePath = path.join("uploads", request.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return response.json({ message: "Temporary file deleted" });
  }
  response.status(404).json({ error: "File not found" });
});

// Save parsed Excel data to DB
router.post("/save/:filename", authMiddleware, async (request, response) => {
  const filePath = `uploads/${request.params.filename}`;

  if (!fs.existsSync(filePath)) {
    return response.status(404).json({ error: "File not found" });
  }

  const fileRecord = await UploadedFile.findOne({
    filename: request.params.filename,
    userId: request.user.id,
  });

  if (!fileRecord) {
    return response
      .status(401)
      .json({ error: "Unauthorized: File not found for this user" });
  }

  try {
    const workbook = XLSX.readFile(filePath);

    if (!workbook.SheetNames.length) {
      return response.status(400).json({ error: "Excel file has no sheets" });
    }

    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const saved = await ExcelData.create({
      fileId: fileRecord._id,
      userId: request.user.id,
      sheetName,
      data: sheetData,
    });

    response.json({
      message: "Excel data saved successfully",
      excelDataId: saved._id,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to parse and save Excel data" });
  }
});

// Get all uploaded files
router.get("/files", authMiddleware, async (request, response) => {
  try {
    const files = await UploadedFile.find({ userId: request.user.id }).sort({
      uploadedAt: -1,
    });
    response.json({ files });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to fetch uploaded files" });
  }
});

// Get all parsed Excel chart data
router.get("/charts", authMiddleware, async (request, response) => {
  try {
    const charts = await ExcelData.find({ userId: request.user.id }).populate(
      "fileId",
      "originalname"
    );
    response.json({ charts });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to fetch charts" });
  }
});

module.exports = router;
