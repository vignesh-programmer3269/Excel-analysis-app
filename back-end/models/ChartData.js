const mongoose = require("mongoose");

const ExcelDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: String,
  originalFileName: String,
  sheetName: String,
  mimeType: String,
  fileSize: Number,
  chartName: String,
  xAxis: String,
  yAxis: String,
  chartType: {
    type: String,
    enum: ["bar", "line", "pie", "scatter", "area"],
    required: true,
  },
  description: String,
  data: [Object],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChartData", ExcelDataSchema);
