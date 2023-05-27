const { FoodsController } = require("../controllers/FoodsController");
const router = require("express").Router();

router.post("/foods/search", FoodsController.search);
router.post("/foods/save-day", FoodsController.saveDay);
router.get("/foods/get-day/:date", FoodsController.getDay);
router.delete("/foods/journal-entry/:id", FoodsController.deleteJournalEntry);
router.put("/foods/change-meal-name/:mealId", FoodsController.changeMealName);

module.exports = router;
