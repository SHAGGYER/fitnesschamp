const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    mealId: mongoose.Types.ObjectId,
    dayId: mongoose.Types.ObjectId,
    food: {
      type: mongoose.Types.ObjectId,
      ref: "Food",
    },
    grams: Number,
  },
  {
    timestamps: true,
  }
);

const JournalEntry = mongoose.model(
  "JournalEntry",
  JournalEntrySchema,
  "journal_entries"
);
module.exports = JournalEntry;
