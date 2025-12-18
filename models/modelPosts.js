const fs = require("fs").promises; // Using promises for cleaner code
const path = require("path");
let data = require("../data");

const dataPath = path.join(__dirname, "../data.json");

const Post = {
  findAll: () => data,

  findById: (id) => data.find((p) => p.id === id),

  create: async (newPostData) => {
    const maxId = data.reduce(
      (max, post) => (post.id > max ? post.id : max),
      0
    );
    const newPost = { id: maxId + 1, ...newPostData };
    data.push(newPost);
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return newPost;
  },

  patch: async (id, updatedData) => {
    const postIndex = data.findIndex((post) => post.id === id);
    if (postIndex === -1) return null;
    data[postIndex] = { ...data[postIndex], ...updatedData };
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return data[postIndex];
  },
  put: async (id, updatedData) => {
    const postIndex = data.findIndex((post) => post.id === id);
    if (postIndex === -1) return null;
    data[postIndex] = { ...data[postIndex], ...updatedData };
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return data[postIndex];
  },
  delete: async (id) => {
    const postIndex = data.findIndex((post) => post.id === id);
    if (postIndex === -1) return null;
    const deletedPost = data.splice(postIndex, 1)[0];
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return deletedPost;
  },
};

module.exports = Post;
