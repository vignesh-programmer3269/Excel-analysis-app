const mongoose = require("mongoose");

const ExcelDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
