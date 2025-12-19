require("dotenv").config();
const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined in .env file");
}

mongoose
  .connect(uri)
  .then(() =>
    console.log("✅ Successfully connected to MongoDB Atlas via Mongoose")
  )
  .catch(() => console.error("❌ MongoDB connection error:", err));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// Use the routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running on port 3000"));
