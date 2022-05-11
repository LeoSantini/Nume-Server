const expressJWT = require("express-jwt"); // Express JWT

function extractTokenFromHeaders(req, res) {
  // Extract token from headers
  if (!req.headers.authorization) {
    // If no authorization header
    return res.status(401).json({ msg: "Unauthorized" }); // Unauthorized
  }
  return req.headers.authorization.split(" ")[1]; // Extract token
}

module.exports = expressJWT({
  secret: process.env.JWT_SECRET, // Secret
  userProperty: "user", // User property
  getToken: extractTokenFromHeaders, // Extract token
  algorithms: ["HS256"], // Algorithms
});
