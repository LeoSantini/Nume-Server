const express = require("express"); // Express
const router = express.Router(); // Router
const Client = require("../models/Client.model"); // Client
const isAuth = require("../middlewares/isAuth"); // Is auth
const attachCurrentUser = require("../middlewares/attachCurrentUser"); // Attach current user
const nodemailer = require("nodemailer"); // Nodemailer

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
}); // Create transporter

router.post("/create-client", async (req, res) => {
  // Create client
  try {
    const newClient = await Client.create(req.body); // Create client

    const mailOptions = {
      from: process.env.EMAIL,
      to: newClient.email,
      bcc: process.env.EMAIL,
      subject: "E-mail Teste",
      html: `<h1>Olá ${newClient.name}</h1>`,
    }; // Mail options

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error sending e-mail" + err,
        });
      } else {
        console.log(info);
      }
    }); // Send mail

    return res.status(201).json(newClient); // Return client
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
});

router.get("/get-clients", isAuth, attachCurrentUser, async (req, res) => {
  // Get All clients
  try {
    const loggedUser = req.currentUser; // Logged user

    if (!loggedUser.userIsActive) {
      return res.status(401).json({ msg: "User is not active" }); // Forbidden
    }

    const clients = await Client.find({ user: loggedUser._id }); // Clients

    return res.status(200).json(clients);
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
}); // Get all clients

router.get("/get-clients/:id", isAuth, attachCurrentUser, async (req, res) => {
  // Get clients by Id
  const { id } = req.params; // Get id
  try {
    const loggedUser = req.currentUser; // Logged user

    if (!loggedUser.userIsActive) {
      return res.status(401).json({ msg: "User is not active" }); // User is not active
    }

    const clientsId = await Client.findOne({ _id: id }); // Get clients

    return res.status(200).json(clientsId);
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
  }
});

router.patch(
  "/update-client/:id",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    // Update client
    const { id } = req.params; // Get id
    try {
      const loggedUser = req.currentUser; // Logged user

      if (!loggedUser.userIsActive) {
        return res.status(401).json({ msg: "User is not active" }); // User is not active
      }

      const updateClient = await Client.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      );

      console.log(updateClient);

      return res.status(200).json(updateClient);
    } catch (err) {
      return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
    }
  }
);

router.delete(
  "/delete-client/:id",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    // Delete client
    const { id } = req.params; // Get id

    try {
      const loggedUser = req.currentUser; // Logged user

      if (!loggedUser.userIsActive) {
        return res.status(401).json({ msg: "User is not active" }); // User is not active
      }

      const deleteClient = await Client.findOneAndDelete({ _id: id }); // Delete client

      return res.status(200).json(deleteClient);
    } catch (err) {
      return res.status(500).json({ msg: "Internal server error:" + err.msg }); // Internal server error
    }
  }
);

module.exports = router; // Exports the router
