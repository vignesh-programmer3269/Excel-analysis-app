const mongoose = require("mongoose");

const uploadedFileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: {
    type: String,
    unique: true,
    required: true,
  },
  originalFileName: String,
  sheetName: String,
  mimeType: String,
  fileSize: Number,
  data: [Object],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FileData", uploadedFileSchema);
