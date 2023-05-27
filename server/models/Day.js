const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    date: Date,
    finished: Boolean,
  },
  {
    timestamps: true,
  }
);

const Day = mongoose.model("Day", DaySchema, "days");
module.exports = Day;
