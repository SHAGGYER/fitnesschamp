const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    email: String,
    password: String,
    maintenanceCalories: Number,
    weight: Number,
    targetWeight: Number,
    height: Number,
    gender: String,
    age: Number,
    goal: String,
    activityLevel: String,
    stripeCustomerId: String,
    stripePaymentMethodId: String,
    stripeSubscriptionId: String,
    stripeSubscriptionStatus: String,
    stripeSubscriptionCanceled: Boolean,
    stripeSubscriptionCurrentPeriodEnd: Date,
    stripeCardBrand: String,
    stripeCardLast4: Number,
    stripeCardExpMonth: Number,
    stripeCardExpYear: Number,
    stripeCardHolderName: String,
    stripeTrialing: Boolean,
    stripeTrialEnd: Date
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  if (!user.password) return next();

  user.password = await bcrypt.hash(user.password, 10);
  return next();
});

const User = mongoose.model("User", UserSchema, "users");
module.exports = User;
