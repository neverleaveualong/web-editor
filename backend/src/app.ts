import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/users";
import { notesRouter } from "./routes/notes";
import cors from "cors";
import { CORS_ALLOWED_ORIGIN } from "./settings";

const app = express();

app.use(
  cors({
    origin: CORS_ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use("/notes", notesRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});

export { app };
