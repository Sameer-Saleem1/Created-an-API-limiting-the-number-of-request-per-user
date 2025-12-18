const { z } = require("zod");

// Schema for a single Post object
const postSchema = z.object({
  topic: z.string().trim().min(1, "Topic is required").toLowerCase(),
  title: z.string().trim().min(3, "Title must be at least 3 chars").max(100),
  views: z.number().int().nonnegative(),
  date: z.coerce
    .date()
    .transform((val) => val.toISOString().split("T")[0])
    .default(() => new Date()),
});

// Schema for URL Parameters
const paramsSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive integer"),
});

// Schema for Query Strings (Sort/Limit)
const querySchema = z.object({
  sort: z.enum(["views", "date"]).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

module.exports = {
  postSchema,
  paramsSchema,
  querySchema,
};
