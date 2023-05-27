import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IRecord {
  date: Date;
  exercise: string;
  weight?: number;
  reps: number;
  oneRepMax: number;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  passwordResetToken?: number;
  exercises: string[];
  records: IRecord[];
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: String,
    password: String,
    passwordResetToken: Number,
    exercises: [String],
    records: [
      {
        date: Date,
        exercise: String,
        weight: Number,
        reps: Number,
        oneRepMax: Number,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 10);
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
