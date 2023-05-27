import mongoose from "mongoose";

export class Db {
  Connect() {
    mongoose.connect(process.env.MONGODB_URI!, () =>
      console.log("Connected to MongoDB")
    );
  }
}
