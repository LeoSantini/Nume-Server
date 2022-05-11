const jwt = require("jsonwebtoken");

function generateToken(user) {
  const { _id, email, name } = user;

  const signature = process.env.TOKEN_SECRET;
  const expiration = "6h";

  return jwt.sign({ _id, email, name }, signature, { expiresIn: expiration });
}

module.exports = generateToken;
