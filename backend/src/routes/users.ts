import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { JWT_SECRET } from "../settings";

const router = Router();

// 회원가입
router.post("/users", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    await User.create({ email, password });
    res.sendStatus(201);
  } catch (error: unknown) {
    // 중복 가입 처리
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as any).code === "ER_DUP_ENTRY"
    ) {
      return res.sendStatus(409);
    }
    console.error(error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

// 로그인
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "잘못된 이메일 또는 비밀번호입니다." });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: "잘못된 이메일 또는 비밀번호입니다." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "14d",
    });

    res.cookie("access-token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development",
    });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

// 로그아웃
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("access-token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
  });
  res.sendStatus(204);
});

export { router as userRouter };
