const Post = require("../models/modelPosts");
const { postSchema, paramsSchema, querySchema } = require("../zod/zodSchema");

exports.getAllPosts = async (req, res) => {
  const queryValidation = querySchema.safeParse(req.query);
  if (!queryValidation.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: queryValidation.error.flatten().fieldErrors,
    });
  }

  try {
    const { sort, limit } = queryValidation.data;
    let query = Post.find();
    if (sort) query = query.sort({ [sort]: -1 });
    if (limit) query = query.limit(limit);

    const posts = await query;
    return res.json({ count: posts.length, posts }); // Added return
  } catch (error) {
    return res.status(500).json({ message: "Error fetching posts" }); // Added return
  }
};

exports.getPostById = async (req, res) => {
  const validation = paramsSchema.safeParse(req.params);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  try {
    const post = await Post.find({ id: validation.data.id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.json({ post });
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving post" });
  }
};

exports.createPost = async (req, res) => {
  const validData = postSchema.safeParse(req.body);
  if (!validData.success) {
    return res.status(400).json({
      errors: validData.error.flatten().fieldErrors,
    });
  }

  try {
    // 1. Find the post with the highest 'id'
    // sort("-id") sorts in descending order (highest first)
    const latestPost = await Post.findOne().sort("-id");

    // 2. Calculate next ID: If a post exists, add 1. If not, start at 1.
    const nextId = latestPost ? latestPost.id + 1 : 1;

    // 3. Create the post
    const newPost = await Post.create({
      ...validData.data,
      id: nextId,
    });

    return res.status(201).json({ status: "Success", post: newPost });
  } catch (error) {
    console.error("Database Error: ", error);
    // Handle potential duplicate key error if two users post at the exact same millisecond
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Conflict: ID generation failed, please try again." });
    }
    return res.status(500).json({ message: "Error saving to database" });
  }
};

// Add this to your postController.js
exports.putPost = async (req, res) => {
  const paramValidation = paramsSchema.safeParse(req.params);
  const bodyValidation = postSchema.safeParse(req.body);

  if (!paramValidation.success || !bodyValidation.success) {
    return res.status(400).json({ message: "Validation failed" });
  }

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { id: paramValidation.data.id },
      bodyValidation.data, // FIXED: Removed the ... spread operator
      { new: true, overwrite: true }
    );

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    return res.status(200).json({ post: updatedPost }); // Added return
  } catch (err) {
    return res.status(500).json({ message: "Error updating the post" }); // Added return
  }
};

exports.patchPost = async (req, res) => {
  const paramValidation = paramsSchema.safeParse(req.params);
  const bodyValidation = postSchema.partial().safeParse(req.body);

  if (!paramValidation.success || !bodyValidation.success) {
    return res.status(400).json({ message: "Validation failed" });
  }

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { id: paramValidation.data.id },
      bodyValidation.data, // FIXED: Removed the ... spread operator
      { new: true }
    );

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    return res.status(200).json({ post: updatedPost }); // Added return
  } catch (err) {
    return res.status(500).json({ message: "Error updating the post" }); // Added return
  }
};

exports.deletePost = async (req, res) => {
  const validation = paramsSchema.safeParse(req.params);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }

  // console.log(typeof parseInt(validation.data.id));

  try {
    const deletedPost = await Post.findOneAndDelete({ id: validation.data.id });
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });

    return res
      .status(200)
      .json({ status: "Deleted successfully", post: deletedPost });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting the post" });
  }
};
