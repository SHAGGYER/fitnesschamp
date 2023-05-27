const path = require("path");
const express = require("express");

const router = express.Router();

router.use("/api/", require("./auth"));
router.use("/api", require("./foods"));
router.use("/api", require("./user"));
router.use("/api", require("./installation"));
router.use("/api", require("./billing"));
router.use("/api", require("./inquiries"));

router.use("/coach", express.static(path.join(__dirname, "../../coach/dist")));
router.get("/coach/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../coach/dist/index.html"));
});

router.use("/", express.static(path.join(__dirname, "../../client/dist")));
router.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

module.exports = router;
