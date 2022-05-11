require("dotenv").config(); // Loads the .env file
require("./config/db.config")(); // Connects to the database

const cors = require("cors"); // Cross-origin resource sharing
const express = require("express"); // Express web framework
const app = express(); // Creates an Express application

app.use(express.json()); // Parse JSON data
app.use(cors({ origin: process.env.REACT_APP_URL })); // Allow cross-origin requests
