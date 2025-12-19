const Post = require("../models/modelPosts");
const { postSchema, paramsSchema, querySchema } = require("../zod/zodSchema");

exports.getAllPosts = async (req, res) => {
  // Added async
  const queryValidation = querySchema.safeParse(req.query);
  if (!queryValidation.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: queryValidation.error.flatten().fieldErrors,
    });
  }

  try {
    const { sort, limit } = queryValidation.data;
    let query = Post.find(); // Mongoose find()

    // Applying Mongoose Sorting
    if (sort) {
      // Sort descending (-1) for highest views or newest date
      query = query.sort({ [sort]: -1 });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const posts = await query;
    res.json({ count: posts.length, posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
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
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving post" });
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

    res.status(201).json({ status: "Success", post: newPost });
  } catch (error) {
    console.error("Database Error: ", error);
    // Handle potential duplicate key error if two users post at the exact same millisecond
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Conflict: ID generation failed, please try again." });
    }
    res.status(500).json({ message: "Error saving to database" });
  }
};

// Add this to your postController.js
exports.putPost = async (req, res) => {
  const paramValidation = paramsSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ errors: paramValidation.error.format() });
  }

  // For PUT, we use the full postSchema (not partial)
  const bodyValidation = postSchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({ errors: bodyValidation.error.format() });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      paramValidation.data.id,
      bodyValidation.data,
      { new: true, overwrite: true } // overwrite: true simulates PUT behavior
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: "Error updating the post" });
  }
};

exports.patchPost = async (req, res) => {
  const paramValidation = paramsSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ errors: paramValidation.error.format() });
  }

  const bodyValidation = postSchema.partial().safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({ errors: bodyValidation.error.format() });
  }

  try {
    // findByIdAndUpdate is the Mongoose way to update
    const updatedPost = await Post.findByIdAndUpdate(
      paramValidation.data.id,
      bodyValidation.data,
      { new: true } // Returns the updated document instead of the old one
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: "Error updating the post" });
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

    res.status(200).json({ status: "Deleted successfully", post: deletedPost });
  } catch (err) {
    res.status(500).json({ message: "Error deleting the post" });
  }
};
