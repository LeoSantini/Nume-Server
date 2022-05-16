const express = require("express"); // Express
const router = express.Router(); // Router
const Client = require("../models/Client.model"); // Client
const User = require("../models/User.model"); // User
const isAuth = require("../middlewares/isAuth"); // Is auth
const attachCurrentUser = require("../middlewares/attachCurrentUser"); // Attach current user

router.post("/create-client", async (req, res) => {
  // Create client
  try {
    const newClient = await Client.create(req.body);

    return res.status(201).json(newClient);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
});

module.exports = router; // Exports the router
