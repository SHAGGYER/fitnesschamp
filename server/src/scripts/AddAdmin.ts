import path from "path";
import mongoose from "mongoose";
import { config } from "dotenv";
import User from "../models/User";
import yargs from "yargs";

config({
  path: path.join(__dirname, "../..", ".env"),
});

const usage = "\nAdds an admin";
const options = yargs
  .usage(usage)
  .option("n", {
    alias: "name",
    describe: "Name",
    type: "string",
    demandOption: true,
  })
  .option("e", {
    alias: "email",
    describe: "Email",
    type: "string",
    demandOption: true,
  })
  .option("p", {
    alias: "password",
    describe: "Password",
    type: "string",
    demandOption: true,
  })
  .help(true).argv;

const { e, _, p, n, ...admin }: any = options;

const run = async () => {
  mongoose.connect(process.env.MONGODB_URI!, () =>
    console.log("Connected to MongoDB")
  );

  const newUser = new User({
    ...admin,
  });

  await newUser.save();

  console.log(`Inserted admin`);
  process.exit(0);
};

run();
