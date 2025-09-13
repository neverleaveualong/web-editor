interface QueryError extends Error {
  code: string;
  errno: number;
}
export function isQueryError(error: unknown): error is QueryError {
  return typeof error === "object" && error !== null && "code" in error;
}
