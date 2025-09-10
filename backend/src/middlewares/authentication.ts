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
    // 3. JWT가 유효한지 비밀 키로 검증하고, 유효하다면 내용을 디코드합니다. [cite: 577]
    const decoded = jwt.verify(accessToken, JWT_SECRET) as { email: string };

    // 4. 디코드된 이메일로 데이터베이스에서 사용자 정보를 찾습니다.
    const user = await User.findByEmail(decoded.email);
    if (!user) {
      return res.sendStatus(401);
    }

    // 5. 찾은 사용자 정보를 req.user에 저장하여 다음 미들웨어나 라우터에서 사용할 수 있게 합니다. [cite: 580]
    req.user = user;

    // 6. 다음 단계로 넘어갑니다. [cite: 581]
    next();
  } catch (error) {
    // JWT 검증에 실패하면 (예: 만료, 변조) 401 에러를 보냅니다. [cite: 577]
    return res.sendStatus(401);
  }
}
