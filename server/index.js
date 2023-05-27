const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const { ParseToken } = require("./middleware/ParseToken");

config({
  path: path.resolve(__dirname, ".env"),
});

mongoose.connect(process.env.MONGODB_URI, () =>
  console.log("Connected to MongoDB")
);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(ParseToken);
app.use(require("./routes/index"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
