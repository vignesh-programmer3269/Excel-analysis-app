const express = require("express");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");

const FileData = require("../models/FileData");
const ChartData = require("../models/ChartData");
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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// Upload file route
router.post(
  "/excel",
  authMiddleware,
  upload.single("file"),
  async (request, response) => {
    try {
      // If no file uploaded

      if (!request.file) {
        return response.status(400).json({ message: "No file uploaded" });
      }
      const filePath = path.join("uploads", request.file.filename);
      const workbook = XLSX.readFile(filePath);

      if (!workbook.SheetNames.length) {
        return response
          .status(400)
          .json({ message: "Excel file has no sheets" });
      }

      const sheetName = workbook.SheetNames[0]; // first sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const uploadedFile = new FileData({
        userId: request.user.id,
        fileName: request.file.filename,
        originalFileName: request.file.originalname,
        sheetName,
        mimeType: request.file.mimetype,
        fileSize: request.file.size,
        data: sheetData,
        uploadedAt: new Date(),
      });

      await uploadedFile.save();

      response.json({
        message: "File uploaded and saved to DB successfully",
        file: uploadedFile,
      });
    } catch (error) {
      console.error("Upload error:", error);
    }
  }
);

// Create chart route
router.post("/chart", authMiddleware, async (request, response) => {
  try {
    const {
      fileName,
      originalFileName,
      fileId,
      sheetName,
      mimeType,
      fileSize,
      chartName,
      xAxis,
      yAxis,
      chartType,
      description,
      data,
    } = request.body;

    const chartData = new ChartData({
      userId: request.user.id,
      fileName,
      originalFileName,
      fileId,
      sheetName,
      mimeType,
      fileSize,
      chartName,
      xAxis,
      yAxis,
      chartType,
      description,
      data,
    });

    await chartData.save();

    response.json({ message: "Chart created successfully", chart: chartData });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Failed to create chart" });
  }
});

// Get a file's data
router.get("/file/:id", authMiddleware, async (request, response) => {
  try {
    const fileId = request.params.id;
    const userId = request.user.id;

    const file = await FileData.findOne({
      _id: fileId,
      userId,
    });

    if (!file) {
      return response.status(404).json({
        message:
          "We couldn’t locate your file. Make sure it has been uploaded and you're accessing the correct file.",
      });
    }
    response.json({ file });
  } catch (error) {
    response.status(404).json({
      message:
        "We couldn’t locate your file. Make sure it has been uploaded and you're accessing the correct file.",
    });
  }
});

// Get a chart's data
router.get("/chart/:id", authMiddleware, async (request, response) => {
  try {
    const chartId = request.params.id;
    const userId = request.user.id;

    const chart = await ChartData.findOne({
      _id: chartId,
      userId,
    });

    if (!chart) {
      return response.status(404).json({
        message:
          "We couldn't find your chart. Please make sure it has been created and that you're accessing the correct chart.",
      });
    }
    response.json({ chart });
  } catch (error) {
    response.status(404).json({
      message:
        "We couldn't find your chart. Please make sure it has been created and that you're accessing the correct chart.",
    });
  }
});

// Get all uploaded files
router.get("/files", authMiddleware, async (request, response) => {
  try {
    const files = await FileData.find({ userId: request.user.id }).sort({
      uploadedAt: -1,
    });

    response.json({ files });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to fetch files" });
  }
});

// Get all created charts
router.get("/charts", authMiddleware, async (request, response) => {
  try {
    const charts = await ChartData.find({ userId: request.user.id }).sort({
      createdAt: -1,
    });

    response.json({ charts });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to fetch charts" });
  }
});

// Delete file route
router.delete(
  "/delete/file/:fileId",
  authMiddleware,
  async (request, response) => {
    try {
      const fileId = request.params.fileId;
      const userId = request.user.id;

      const deletedFile = await FileData.findOneAndDelete({
        _id: fileId,
        userId,
      });

      if (!deletedFile) {
        return response
          .status(404)
          .json({ message: "File not found or unauthorized" });
      }

      const filePath = path.join("uploads", deletedFile.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return response.json({
        message: "Your file deleted successfully",
        deletedFile,
      });
    } catch (error) {
      console.error("Delete error:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

// Delete chart route
router.delete(
  "/delete/chart/:id",
  authMiddleware,
  async (request, response) => {
    try {
      const chartId = request.params.id;

      const deletedChart = await ChartData.findOneAndDelete({
        _id: chartId,
        userId: request.user.id,
      });

      if (!deletedChart) {
        return response
          .status(404)
          .json({ message: "Chart not found or unauthorized" });
      }

      response.json({ message: "Chart deleted successfully", deletedChart });
    } catch (error) {
      console.error("Delete chart error:", error);
      response.status(500).json({ message: "Failed to delete chart" });
    }
  }
);

module.exports = router;
