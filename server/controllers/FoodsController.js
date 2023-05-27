const Food = require("../models/Food");
const Meal = require("../models/Meal");
const Day = require("../models/Day");
const JournalEntry = require("../models/JournalEntry");
const moment = require("moment");

exports.FoodsController = class {
  static changeMealName = async (req, res) => {
    const meal = await Meal.findById(req.params.mealId);
    meal.name = req.body.name;
    await meal.save();

    res.send({meal});
  };

  static search = async (req, res) => {
    const foods = await Food.fuzzySearch(req.body.name).limit(10).skip(req.query.skip);

    return res.send({foods});
  };

  static getMeals = async (req, res) => {
    const meals = await Meal.find({user: res.locals.userId});

    res.send({meals});
  };

  static getDay = async (req, res) => {
    let day = await Day.findOne({
      user: res.locals.userId,
      date: req.params.date,
    });

    let journal_entries = [];

    if (day) {
      journal_entries = await JournalEntry.find({
        dayId: day._id,
      }).populate("food");
    }

    res.send({day, journal_entries});
  };

  static saveDay = async (req, res) => {
    let day = await Day.findOne({
      user: res.locals.userId,
      date: req.body.date,
    });

    if (!day) {
      day = new Day({
        user: res.locals.userId,
        date: req.body.date,
        finished: req.body.finished,
      });

      await day.save();
    } else {
      if (req.body.finished) {
        day.finished = true;
        await day.save();
      }
    }

    for (let food of req.body.chosenFoods) {
      if (food._id) {
        let journalEntry = await JournalEntry.findById(food._id);
        journalEntry.grams = food.grams;
        await journalEntry.save();
      } else {
        let journalEntry = new JournalEntry({
          user: res.locals.userId,
          mealId: food.mealId,
          grams: food.grams,
          food: food.food._id,
          dayId: day._id,
        });
        await journalEntry.save();

        const selectedFood = await Food.findById(food.food._id);
        selectedFood.selectCount = selectedFood.selectCount
          ? selectedFood.selectCount + 1
          : 1;
        await selectedFood.save();
      }
    }

    res.send({day, chosenFoods: req.body.chosenFoods});
  };

  static deleteJournalEntry = async (req, res) => {
    await JournalEntry.deleteOne({_id: req.params.id});
    res.sendStatus(204);
  };
};
