require("dotenv").config(); // Loads the .env file
require("./config/db.config")(); // Connects to the database

const cors = require("cors"); // Cross-origin resource sharing
const express = require("express"); // Express web framework
const app = express(); // Creates an Express application

app.use(express.json()); // Parse JSON data
app.use(cors({ origin: process.env.REACT_APP_URL })); // Allow cross-origin requests

const exphbs = require("express-handlebars"); // Handlebars
app.engine("handlebars", exphbs()); // Set handlebars as the default engine
app.set("view engine", "handlebars"); // Set handlebars as the default engine

const userRouter = require("./routes/users.routes"); // User routes
app.use("/users", userRouter); // User routes

const clientRouter = require("./routes/client.routes"); // Client routes
app.use("/client", clientRouter); // Client routes

app.listen(Number(process.env.PORT) || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
}); // Server running on port 4000 || 3000
