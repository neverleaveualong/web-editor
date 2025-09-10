import { User } from "../../src/models/user";
import { Note } from "../../src/models/note";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      note?: Note;
    }
  }
}
