const mongoose = require("mongoose");

const uploadedFileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  path: String,
  mimetype: String,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UploadedFile", uploadedFileSchema);
