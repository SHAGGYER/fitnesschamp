const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const FoodSchema = new mongoose.Schema(
  {
    name: String,
    group: String,
    kcal: Number,
    protein: Number,
    carbs: Number,
    sugars: Number,
    fibers: Number,
    fats: Number,
    selectCount: Number,
  },
  {
    timestamps: true,
  }
);
FoodSchema.plugin(mongoose_fuzzy_searching, { fields: ["name"] });

const Food = mongoose.model("Food", FoodSchema, "foods");
module.exports = Food;
