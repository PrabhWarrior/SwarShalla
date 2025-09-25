export interface User {
  user_id?: string;
  name: string;
  email: string;
  password_hash: string;
  role?: "teacher" | "student" | "admin";
  is_blind?: number;
}
