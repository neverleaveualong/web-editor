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

  /**
   * 새로운 사용자를 생성합니다.
   * 비밀번호를 해싱하여 데이터베이스에 저장합니다.
   */
  static async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    // 1. bcrypt를 사용해 평문 비밀번호를 해시합니다.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 2. 데이터베이스에 이메일과 암호화된 비밀번호를 저장합니다.
    const sql = "INSERT INTO users (email, encrypted_password) VALUES (?, ?)";
    await db.execute(sql, [email, hashedPassword]);
  }

  /**
   * 이메일 주소로 사용자를 찾습니다.
   * @returns User 인스턴스 또는 null
   */
  static async findByEmail(email: string): Promise<User | null> {
    const sql = "SELECT * FROM users WHERE email = ?";

    // 1. <UserData[]> 제네릭을 제거하고 라이브러리가 주는 그대로 결과를 받습니다.
    const [rows] = await db.query(sql, [email]);

    // 2. 'rows'의 타입이 UserData[] 형태임을 우리가 TypeScript에게 보증(as)합니다.
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
