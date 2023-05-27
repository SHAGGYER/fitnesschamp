import { Request, Response } from "express";
import User from "../models/User";
import { AuthService } from "../services/AuthService";
import { Controller } from "../decorators/Controller";
import { Get, Post } from "../decorators/RequestMethods";
import { BaseController } from "./Controller";
import { ValidateBody } from "../decorators/Validation";
import { RegisterDto } from "../dtos/Auth.dto";

@Controller("/api/auth")
export default class AuthController extends BaseController {
  @Get("/init")
  public async init(req: Request, res: Response) {
    const user = await User.findById(res.locals.userId);

    return res.json({
      user,
    });
  }

  @Post("/login")
  public async login(req: Request, res: Response) {
    if (!(await AuthService.checkEmailExists(req.body.email))) {
      return res.status(401).send({ message: "Could not log you in" });
    }

    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (
      !(await AuthService.verifyPassword(req.body.password, user!.password))
    ) {
      return res.status(401).send({ message: "Could not log you in" });
    }

    const token = AuthService.createToken(user!);

    return res.status(200).send({ token, user });
  }

  @ValidateBody(RegisterDto)
  @Post("/register")
  public async register(req: Request, res: Response) {
    if (await AuthService.checkEmailExists(req.body.email)) {
      return res
        .status(422)
        .send({ errors: { email: "This email already exists" } });
    }

    if (req.body.password !== req.body.passwordConfirmation) {
      return res
        .status(422)
        .send({ errors: { passwordConfirmation: "Passwords do not match" } });
    }

    const user = new User({
      ...req.body,
      exercises: [],
    });
    await user.save();
    const token = AuthService.createToken(user!);

    return res.send({ token });
  }
}
