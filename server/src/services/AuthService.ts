import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  public static async checkEmailExists(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user;
  }

  public static async verifyPassword(
    password: string,
    userPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }

  public static createToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );
  }
}
