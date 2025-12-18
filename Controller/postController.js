const Post = require("../models/modelPosts");
const { postSchema, paramsSchema, querySchema } = require("../zod/zodSchema");
// console.log(Post.findAll());

exports.getAllPosts = (req, res) => {
  const posts = Post.findAll();
  res.json({ posts: posts });
};

exports.getPostById = (req, res) => {
  const id = paramsSchema.safeParse(req.params);
  console.log(id);
  if (!id.success) {
    return res.status(400).json({
      message: "Invalid ID parameter",
      errors: id.error.flatten().fieldErrors,
    });
  }
  const post = Post.findById(id.data.id);

  if (!post) {
    return res
      .status(404)
      .json({ message: `Post with ID '${id.data.id}' not found.` });
  }
  res.json({ post: post });
};

exports.createPost = async (req, res) => {
  const validData = postSchema.safeParse(req.body);
  if (!validData.success) {
    return res.status(400).json({
      message: "Invalid post data",
      errors: validData.error.flatten().fieldErrors,
    });
  }

  try {
    const newPost = await Post.create(validData.data);
    res
      .status(201)
      .json({ status: "Post Created Successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Error saving your data" });
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

  const id = paramValidation.data.id;

  try {
    const updatedPost = await Post.patch(id, bodyValidation.data);
    res.status(200).json({ post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: "Error updating the post" });
  }
};

exports.putPost = async (req, res) => {
  const paramValidation = paramsSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ errors: paramValidation.error.format() });
  }
  const bodyValidation = postSchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({ errors: bodyValidation.error.format() });
  }

  if (!paramValidation.data.id) {
    const maxId = data.reduce(
      (max, post) => (post.id > max ? post.id : max),
      0
    );
    bodyValidation.data.id = maxId + 1;
  } else {
    bodyValidation.data.id = paramValidation.data.id;
  }

  const id = bodyValidation.data.id;

  try {
    const updatedPost = await Post.put(id, bodyValidation.data);
    res.status(200).json({ post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: "Error updating the post" });
  }
};

exports.deletePost = async (req, res) => {
  const paramValidation = paramsSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ errors: paramValidation.error.format() });
  }

  const id = paramValidation.data.id;

  try {
    const deletedPost = await Post.delete(id);

    // CRITICAL FIX: Check if the post actually existed
    if (!deletedPost) {
      return res.status(404).json({ message: `Post with ID ${id} not found.` });
    }

    // This will only run if the return above didn't trigger
    return res.status(200).json({
      status: "Post Deleted Successfully",
      post: deletedPost,
    });
  } catch (err) {
    // If headers were already sent in the 'try' block,
    // check before sending a 500
    if (!res.headersSent) {
      return res.status(500).json({ message: "Error deleting the post" });
    }
  }
};
