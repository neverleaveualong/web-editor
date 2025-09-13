import { Router, Request, Response } from "express";
import { authenticateUser } from "../middlewares/authentication";
import { authorizeNote } from "../middlewares/authorization";
import { Note } from "../models/note";

const router = Router();

router.use(authenticateUser);

// 노트 목록 조회
router.get("/", async (req: Request, res: Response) => {
  const notes = await Note.findAllByUserId(req.user.id);
  res.json(notes);
});

// 노트 생성
router.post("/", async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const note = await Note.create({ title, content, user_id: req.user.id });
  res.status(201).json(note);
});

// 노트 상세 조회
router.get("/:id", authorizeNote, async (req: Request, res: Response) => {
  res.json(req.note);
});

// 노트 수정
router.put("/:id", authorizeNote, async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const updatedNote = await Note.update(req.note.id, { title, content });
  res.json(updatedNote);
});

// 노트 삭제
router.delete("/:id", authorizeNote, async (req: Request, res: Response) => {
  await Note.delete(req.note.id);
  res.sendStatus(204);
});

export { router as notesRouter };
