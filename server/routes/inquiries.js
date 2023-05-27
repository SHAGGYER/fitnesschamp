const {InquiriesController} = require("../controllers/InquiriesController");
const router = require("express").Router();

router.post("/inquiries", InquiriesController.create);
router.get("/inquiries", InquiriesController.getAll);

module.exports = router;
