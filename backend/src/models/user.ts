import bcrypt from "bcrypt";
import { db } from "../utils/mysql";

const SALT_ROUNDS = 10;

interface UserData {
  id: number;
  email: string;
  encrypted_password: string;
}

export class User {
  id: number;
  email: string;
  encrypted_password: string;

  constructor(userData: UserData) {
    this.id = userData.id;
    this.email = userData.email;
    this.encrypted_password = userData.encrypted_password;
  }

  static async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const sql = "INSERT INTO users (email, encrypted_password) VALUES (?, ?)";
    await db.execute(sql, [email, hashedPassword]);
  }

  /**
   * 이메일 주소로 사용자를 찾습니다.
   * @returns User 인스턴스 또는 null
   */
  static async findByEmail(email: string): Promise<User | null> {
    const sql = "SELECT * FROM users WHERE email = ?";

    const [rows] = await db.query(sql, [email]);

    const users = rows as UserData[];

    if (users.length > 0) {
      return new User(users[0]);
    }

    return null;
  }

  /**
   * 입력된 평문 비밀번호와 DB에 저장된 해시 비밀번호를 비교합니다.
   * @returns 비밀번호 일치 여부 (true/false)
   */
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.encrypted_password);
  }

  // 여기에 다른 CRUD 메서드(Update, Delete 등)를 추가할 수 있습니다.
}
