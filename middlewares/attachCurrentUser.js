const User = require("../models/User.model"); // User is the name of the collection

module.exports = async (req, res, next) => {
  try {
    const loggedUser = req.body ? req.body.user : req.user; // Logged user

    const user = await User.findOne(
      {
        _id: loggedUser._id, // User id
      },
      { passwordHash: 0, __v: 0 } // Exclude password hash and version
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" }); // User not found
    }

    req.currentUser = user; // Current user

    next(); // Next middleware
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
};
