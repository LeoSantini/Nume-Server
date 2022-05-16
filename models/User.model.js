const mongoose = require("mongoose"); // MongoDB driver
const Schema = mongoose.Schema; // Schema constructor

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true }, // Name of the user

  lastName: { type: String, required: true, trim: true }, // Last name of the user

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[A-Za-z0-9._%+-]+@numeeventos.com$/gm,
  }, // Email of the user

  birthday: { type: Date, required: true }, // Birthday of the user

  cpf: { type: String, required: true, unique: true, trim: true }, // CPF of the user

  rg: { type: String, required: true, unique: true, trim: true }, // RG of the user

  phone: { type: String, required: true, trim: true }, // Phone number of the user

  passwordHash: { type: String, required: true }, // Password hash of the user

  resetPasswordToken: { type: String, default: "" }, // Reset password token

  createDate: { type: Date, default: Date.now }, // Date of creation of the user

  userIsActive: { type: Boolean, default: true }, // User is active

  role: { type: String, default: "ADMIN" }, // Role of the user

  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, // Client of the user
});

const User = mongoose.model("User", UserSchema); // User is the name of the collection

module.exports = User; // Exports the User model
