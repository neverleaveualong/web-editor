import mysql from "mysql2/promise";
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
} from "../settings";

// Connection Pool 생성
// 데이터베이스에 요청이 있을 때마다 새로 연결하는 대신,
// 미리 정해진 수의 연결을 만들어두고 재사용하여 성능을 향상시킵니다.
export const db = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
