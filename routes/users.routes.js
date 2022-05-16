const express = require("express"); // Express
const router = express.Router(); // Router
const isAuth = require("../middlewares/isAuth"); // Is auth
const attachCurrentUser = require("../middlewares/attachCurrentUser"); // Attach current user
const bcrypt = require("bcrypt"); // Bcrypt
const generateToken = require("../config/jwt.config"); // JWT
const User = require("../models/User.model"); // User

const saltRounds = 10; // Salt rounds

router.post("/create-user", async (req, res) => {
  // Create user
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

router.post("/login", async (req, res) => {
  // Login
  try {
    const { email, password } = req.body; // Email and password

    const user = await User.findOne({ email }); // User

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password." }); // Invalid email or password
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Is password valid

    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid email or password." }); // Invalid email or password
    }

    const token = generateToken(user); // Token

    return res.status(200).json({
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
});

router.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  // Profile
  try {
    const loggedUser = req.currentUser; // Logged user

    if (!loggedUser.userIsActive) {
      return res.status(401).json({ msg: "Unauthorized" }); // Unauthorized
    }

    if (loggedUser) {
      const getUser = await User.findById(loggedUser._id); // Get user

      delete getUser._doc.passwordHash; // Delete password hash
      delete getUser._doc.resetPasswordToken; // Delete reset password token
      delete getUser._doc.__v; // Delete version

      console.log(getUser);
      return res.status(200).json(getUser); // Ok
    } else {
      return res.status(404).json({ msg: "User not found" }); // Not found
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
});

router.patch("/update-profile", isAuth, attachCurrentUser, async (req, res) => {
  // Update profile
  try {
    const loggedUser = req.currentUser; // Logged user

    if (!loggedUser.userIsActive) {
      return res.status(401).json({ msg: "Unauthorized" }); // Unauthorized
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: loggedUser._id },
      { ...req.body },
      { new: true }
    );

    delete updateUser._doc.passwordHash; // Delete password hash
    delete updateUser._doc.resetPasswordToken; // Delete reset password token
    delete updateUser._doc.__v; // Delete version

    return res.status(200).json(updateUser); // Ok
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
});

router.delete(
  "/delete-profile",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    // Delete profile
    try {
      const loggedUser = req.currentUser; // Logged user

      const disableUser = await User.findOneAndUpdate(
        { _id: loggedUser._id },
        { userIsActive: false },
        { new: true }
      );

      delete disableUser._doc.passwordHash; // Delete password hash
      delete disableUser._doc.resetPasswordToken; // Delete reset password token
      delete disableUser._doc.__v; // Delete version

      return res.status(200).json(disableUser); // Ok
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
    }
  }
);

router.patch(
  "/activate-profile",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    // Activate profile
    try {
      const loggedUser = req.currentUser; // Logged user

      const activateUser = await User.findOneAndUpdate(
        { _id: loggedUser._id },
        { userIsActive: true },
        { new: true, runValidators: true }
      );

      delete activateUser._doc.passwordHash; // Delete password hash
      delete activateUser._doc.resetPasswordToken; // Delete reset password token
      delete activateUser._doc.__v; // Delete version

      return res.status(200).json(activateUser); // Ok
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
    }
  }
);
module.exports = router; // Exports router
