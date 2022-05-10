const mongoose = require("mongoose"); // MongoDB driver

async function connect() {
  // Connects to the database
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB:", dbConnection.connection.name); // Logs the connection name
  } catch (error) {
    // Catches errors
    console.log("Error connecting to MongoDB:", error); // Logs the error
  }
}

module.exports = connect; // Exports the connect function
