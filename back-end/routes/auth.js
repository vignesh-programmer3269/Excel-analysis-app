const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login Route
router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) return response.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return response.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      "excel-sheet-analysis-secret-code",
      { expiresIn: "7d" }
    );

    response.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server error" });
  }
});

// Register Route
router.post("/register", async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return response.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    response.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
