import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../settings";
import { User } from "../models/user";

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. 요청 쿠키에서 'access-token'을 가져옵니다. [cite: 573]
  const accessToken = req.cookies["access-token"];

  // 2. 토큰이 없으면 401 Unauthorized 에러를 보냅니다. [cite: 569, 576]
  if (!accessToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as {
      id: number;
      email: string;
    };

    const user = await User.findByEmail(decoded.email);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}
