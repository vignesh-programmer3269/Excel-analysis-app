require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const connectDB = require("./db");
const multer = require("multer");
const upload = require("./routes/upload");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", upload);

app.use((err, req, res, next) => {
  console.error("Global error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(413)
        .json({ message: "File too large. Max size is 5 MB" });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Only Excel files are allowed!") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
