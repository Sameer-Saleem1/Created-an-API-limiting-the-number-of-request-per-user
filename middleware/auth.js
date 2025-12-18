const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Auth Middleware triggered - currently allowing all traffic");
  next();
};

module.exports = verifyToken;
