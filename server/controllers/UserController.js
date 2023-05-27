const User = require("../models/User");

exports.UserController = class {
  static finishSetup = async (req, res) => {
    const user = await User.findById(res.locals.userId);
    user.maintenanceCalories = parseInt(req.body.kcal);
    user.weight = req.body.weight;
    user.targetWeight = req.body.targetWeight;
    user.age = req.body.age;
    user.height = req.body.height;
    user.gender = req.body.gender;
    user.goal = req.body.goal;
    user.activityLevel = req.body.activityLevel;
    await user.save();

    res.send({ user });
  };
};
