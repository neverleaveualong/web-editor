import { db } from "../utils/mysql";

interface NoteData {
  id: number;
  title: string;
  content: string;
  user_id: number;
}

export class Note {
  id: number;
  title: string;
  content: string;
  user_id: number;

  constructor(noteData: NoteData) {
    this.id = noteData.id;
    this.title = noteData.title;
    this.content = noteData.content;
    this.user_id = noteData.user_id;
  }

  static async findById(id: number): Promise<Note | null> {
    const sql = "SELECT * FROM notes WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    const notes = rows as NoteData[];
    return notes.length > 0 ? new Note(notes[0]) : null;
  }
}
