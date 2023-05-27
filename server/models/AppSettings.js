const mongoose = require("mongoose");

const AppSettingsSchema = new mongoose.Schema(
  {
    appName: String,
  },
  {
    timestamps: true,
  }
);

const AppSettings = mongoose.model(
  "AppSettings",
  AppSettingsSchema,
  "app_settings"
);
module.exports = AppSettings;
