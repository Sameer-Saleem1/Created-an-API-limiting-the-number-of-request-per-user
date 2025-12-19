const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "PostMaster REST API",
    description:
      "This is a REST API made for the posts, it performs all the CRUD operation.",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/authRoutes.js", "./routes/postRoutes.js"];

swaggerAutogen(outputFile, routes, doc);
