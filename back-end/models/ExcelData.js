const mongoose = require("mongoose");

const ExcelDataSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadedFile",
    required: true,
  },
  sheetName: String,
  data: [Object],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ExcelData", ExcelDataSchema);
