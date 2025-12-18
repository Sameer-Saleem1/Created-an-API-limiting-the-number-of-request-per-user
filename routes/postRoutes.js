const express = require("express");
const router = express.Router();
const postController = require("../Controller/postController");

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.put("/:id", postController.putPost);
router.patch("/:id", postController.patchPost);
router.delete("/:id", postController.deletePost);

// For JWT authentication

// router.post("/", verifyToken, postController.createPost);
// router.put("/:id", verifyToken, postController.putPost);
// router.patch("/:id", verifyToken, postController.patchPost);
// router.delete("/:id", verifyToken, postController.deletePost);

module.exports = router;
