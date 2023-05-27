const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: String,
  },
  {
    timestamps: true,
  }
);

const meal = mongoose.model("meal", mealSchema, "meals");
module.exports = meal;
