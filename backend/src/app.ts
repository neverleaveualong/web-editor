import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/users";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});

export { app };
