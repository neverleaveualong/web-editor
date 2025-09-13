import { Request, Response, NextFunction } from "express";
import { Note } from "../models/note";

export async function authorizeNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const noteId = parseInt(req.params.id, 10);
  if (isNaN(noteId)) {
    return res.status(400).json({ message: "Invalid note ID parameter" });
  }

  const user = req.user;
  if (!user) {
    return res.sendStatus(401);
  }

  const note = await Note.findById(noteId);

  if (!note) {
    return res.sendStatus(404);
  }

  if (note.user_id !== user.id) {
    return res.sendStatus(403);
  }

  req.note = note;
  next();
}
