const express = require("express"); // Express
const router = express.Router(); // Router
const isAuth = require("../middlewares/isAuth"); // Is auth
const attachCurrentUser = require("../middlewares/attachCurrentUser"); // Attach current user
const bcrypt = require("bcrypt"); // Bcrypt
const generateToken = require("../config/jwt.config"); // JWT
const User = require("../models/User.model"); // User

const saltRounds = 10; // Salt rounds

router.post("/create-user", async (req, res) => {
  try {
    const { password } = req.body; // Password

    if (
      !password ||
      !password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Invalid password. Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      }); // Invalid password
    }
    const salt = await bcrypt.genSalt(saltRounds); // Salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hashed password

    const newUser = await User.create({
      ...req.body,
      passwordHash: hashedPassword,
    }); // New user

    delete newUser._doc.passwordHash; // Delete password hash
    delete newUser._doc.resetPasswordToken; // Delete reset password token
    delete newUser._doc.__v; // Delete version

    console.log(newUser);
    return res.status(201).json(newUser._doc); // Created
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
});

module.exports = router; // Exports router
