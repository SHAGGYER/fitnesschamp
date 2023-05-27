const {
  InstallationController,
} = require("../controllers/InstallationController");
const router = require("express").Router();

router.post("/installation/app-name", InstallationController.setAppName);
router.post("/installation/foods", InstallationController.populateFoodDatabase);

module.exports = router;
