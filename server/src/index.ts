import { Server } from "./kernel/Server";
import path from "path";
import { config } from "dotenv";

config({
  path: path.join(__dirname, "..", "/.env"),
});

const server = new Server();
server.run();
