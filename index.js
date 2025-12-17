const express = require("express");
const app = express();
const PORT = 3000;
const data = require("./data");
const fixedWindowLimit = require("./middleware/fixedWindowLimit");

app.use(fixedWindowLimit(10, 60000));
app.get("/api/topics/:topic/posts", (req, res) => {
  const topic = req.params.topic.toLowerCase();

  let results = data.filter((post) => post.topic === topic);

  if (results.length === 0) {
    return res.status(404).json({ message: `Topic ID '${topic}' not found.` });
  }

  const { sort, limit } = req.query;

  if (sort === "views") {
    results.sort((a, b) => b.views - a.views);
  } else if (sort === "date") {
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (limit) {
    const limitCount = parseInt(limit);
    if (!isNaN(limitCount) && limitCount > 0) {
      results = results.slice(0, limitCount);
    }
  }

  res.json({ posts: results });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
