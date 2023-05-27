const { UserController } = require("../controllers/UserController");
const router = require("express").Router();

router.post("/user/finish-setup", UserController.finishSetup);

module.exports = router;
