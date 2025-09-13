import { db } from "../utils/mysql";

interface NoteData {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export class Note {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;

  constructor(noteData: NoteData) {
    this.id = noteData.id;
    this.title = noteData.title;
    this.content = noteData.content;
    this.user_id = noteData.user_id;
    this.created_at = noteData.created_at;
    this.updated_at = noteData.updated_at;
  }

  static async findById(id: number): Promise<Note | null> {
    const sql = "SELECT * FROM notes WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    const notes = rows as NoteData[];
    return notes.length > 0 ? new Note(notes[0]) : null;
  }

  static async findAllByUserId(userId: number): Promise<Note[]> {
    const sql =
      "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC";
    const [rows] = await db.query(sql, [userId]);
    return (rows as NoteData[]).map((noteData) => new Note(noteData));
  }

  static async create(data: {
    title: string;
    content: string;
    user_id: number;
  }): Promise<Note> {
    const sql = "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)";
    const [result] = await db.execute(sql, [
      data.title,
      data.content,
      data.user_id,
    ]);
    // @ts-ignore
    const insertedId = result.insertId;
    return new Note({ id: insertedId, ...data });
  }

  static async update(
    id: number,
    data: { title: string; content: string }
  ): Promise<Note | null> {
    const sql =
      "UPDATE notes SET title = ?, content = ?, updated_at = NOW() WHERE id = ?";
    await db.execute(sql, [data.title, data.content, id]);
    return this.findById(id);
  }

  static async delete(id: number): Promise<void> {
    const sql = "DELETE FROM notes WHERE id = ?";
    await db.execute(sql, [id]);
  }
}
