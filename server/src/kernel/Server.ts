import "reflect-metadata";
import express, { Application } from "express";
import { Db } from "./Db";
import { ParseToken } from "../middleware/ParseToken";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { getControllers } from "../controllers/index";
import { RouteDefinition } from "../decorators/RouteDefinition";

export class Server {
  private app: Application;

  public async run() {
    this.app = express();

    const db = new Db();
    db.Connect();

    this.loadMiddleware();
    const controllers = await getControllers();
    controllers.forEach((controller) => {
      // This is our instantiated class
      const instance = new controller();
      // The prefix saved to our controller
      const prefix = Reflect.getMetadata("prefix", controller);
      // Our `routes` array containing all our routes for this controller
      const routes: Array<RouteDefinition> = Reflect.getMetadata(
        "routes",
        controller
      );
      // Iterate over all routes and register them to our express application
      routes.forEach((route) => {
        // It would be a good idea at this point to substitute the `app[route.requestMethod]` with a `switch/case` statement
        // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
        // this should be enough for now.

        if (!route.middlewares) {
          this.app[route.requestMethod](
            prefix + route.path,
            async (
              req: express.Request,
              res: express.Response,
              next: express.NextFunction
            ) => {
              // Execute our method for this path and pass our express request and response object.
              try {
                await instance[route.methodName](req, res);
              } catch (err) {
                next(err);
              }
            }
          );
        } else {
          this.app[route.requestMethod](
            prefix + route.path,
            ...route.middlewares,
            async (
              req: express.Request,
              res: express.Response,
              next: express.NextFunction
            ) => {
              // Execute our method for this path and pass our express request and response object.
              try {
                await instance[route.methodName](req, res);
              } catch (err) {
                next(err);
              }
            }
          );
        }
      });
    });

    const httpServer = this.app.listen(process.env.NODE_PORT, () =>
      console.log(`Server started on port ${process.env.NODE_PORT}`)
    );
  }

  private loadMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(ParseToken);
  }
}
