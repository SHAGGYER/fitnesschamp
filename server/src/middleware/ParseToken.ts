import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const ParseToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next();
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) return next();

  try {
    res.locals.token = token;

    const { userId, userAccessLevel, user } = <any>(
      jwt.verify(token, process.env.JWT_SECRET!)
    );

    if (!userId) {
      return next();
    }

    res.locals.userId = userId;
    res.locals.userAccessLevel = userAccessLevel;
    return next();
  } catch (e) {
    return next();
  }
};
