const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  id: { type: Number },
  topic: { type: String, required: true, lowercase: true },
  title: { type: String, required: true },
  views: { type: Number, default: 0 },
  date: { type: String, required: true }, // Stored as YYYY-MM-DD string
});

const Post = mongoose.model("posts", postSchema, "Post");

// We export the Mongoose model directly
module.exports = Post;
