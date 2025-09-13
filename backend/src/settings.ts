import dotenv from "dotenv";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

dotenv.config();
export const PORT = process.env.PORT || 3031;

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);

export const DB_USER = requireEnv("DB_USER");
export const DB_PASSWORD = requireEnv("DB_PASSWORD");
export const DB_DATABASE = requireEnv("DB_DATABASE");
export const JWT_SECRET = requireEnv("JWT_SECRET");

export const CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN || "";
