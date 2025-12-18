const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "your_super_secret_key_123"; // In production, use .env

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  if (User.findByUsername(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword });

  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = User.findByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
};
