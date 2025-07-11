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

app.get("/", (request, response) => {
  response.send("Hello, World!");
  console.log("GET request received at /");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
