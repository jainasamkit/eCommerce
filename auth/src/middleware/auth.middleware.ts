import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

const { JWT_SECRET } = env;

interface IUserToken {
  id: string;
  role: string;
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  const decodedToken = jwt.verify(token, JWT_SECRET!) as IUserToken;
  req.user = decodedToken;
  next();
};

const authoriseUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
  roles: Array<string>
) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export { authenticateUser, authoriseUser };
