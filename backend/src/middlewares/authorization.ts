import { Request, Response, NextFunction } from "express";
import { Note } from "../models/note";

export async function authorizeNote(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. URL 파라미터에서 노트 ID를 가져옵니다.
  const noteId = parseInt(req.params.id, 10);
  // 2. authenticateUser에서 저장해 둔 로그인 사용자 정보를 가져옵니다. [cite: 604]
  const user = req.user!;

  // 3. 노트 ID로 DB에서 노트 정보를 찾습니다. [cite: 609]
  const note = await Note.findById(noteId);

  // 4. 노트가 존재하지 않으면 404 Not Found 에러를 보냅니다. [cite: 609]
  if (!note) {
    return res.sendStatus(404);
  }

  // 5. 노트의 소유자(note.user_id)와 로그인한 사용자(user.id)가 일치하는지 확인합니다. [cite: 601, 610]
  if (note.user_id !== user.id) {
    // 소유자가 아니면 403 Forbidden 에러를 보냅니다. [cite: 610]
    return res.sendStatus(403);
  }

  // 6. 찾은 노트 정보를 req.note에 저장하여 다음 라우터에서 사용하게 합니다. [cite: 606]
  req.note = note;

  // 7. 다음 단계로 넘어갑니다. [cite: 607]
  next();
}
