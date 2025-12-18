const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// Use the routes
app.use("/api/posts", postRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
