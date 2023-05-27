const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    appName: String,
    type: String,
    details: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model(
  "Inquiry",
  InquirySchema,
  "inquiries"
);
module.exports = Inquiry;
