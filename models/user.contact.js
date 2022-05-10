const mongoose = require("mongoose"); // MongoDB driver
const Schema = mongoose.Schema; // Schema constructor

const userContactSchema = new Schema({
  // eslint-disable-line
  name: { type: String, required: true }, // Name of the contact
  phone: { type: String, required: true }, // Phone number of the contact
  email: { type: String, required: true }, // Email of the contact
  contactType: { type: String, required: true }, // Type of the contact
  eventData: new Schema({
    // Event data of the contact
    eventType: {
      type: String,
      required: true,
      enum: [
        "Casamento",
        "Debutante",
        "Bodas",
        "Batizado",
        "Chá Revelação",
        "Feira",
        "Simpósio",
        "Reunião de Líder",
        "Evento Temático",
        "Palestra",
        "Kits de entrega",
      ],
    }, // Type of the event
    eventDate: { type: Date, required: true }, // Date of the event
    eventPlace: { type: String, required: true }, // Place of the event
    eventTime: { type: String, required: true }, // Time of the event
  }),
  investment: new Schema({
    investmentValue: { type: Number, required: true }, // Value of the investment
    serviceType: {
      type: String,
      required: true,
      enum: ["Completa", "Parcial", "Personalizada"],
    }, // Type of the service
    supplierName: { type: String }, // Name of the supplier
    note: { type: String }, // Note of the investment
  }),
});

const UserContact = mongoose.model("UserContact", userContactSchema); // UserContact is the name of the collection

module.exports = UserContact; // Exports the UserContact model
