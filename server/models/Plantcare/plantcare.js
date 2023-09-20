const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plantCareSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const PlantCare = mongoose.model('PlantCare', plantCareSchema);

module.exports = PlantCare;
