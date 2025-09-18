import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/sqlite/userRepo";
import authRepo from "../repositories/sqlite/authRepo";
import { User } from "../interfaces/userInterface";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

const registerService = async (
  name: string,
  email: string,
  password: string,
  role: "teacher" | "student" | "admin",
  is_blind = 0
) => {
  const existing = userRepo.getUserByEmailRepo(email);
  if (existing) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);
  const user: any = userRepo.createUserRepo({
    name,
    email,
    password_hash: hash,
    role,
    is_blind,
  });
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginService = async (email: string, password: string) => {
  const user = userRepo.getUserByEmailRepo(email) as User;
  if (!user) throw new Error("Invalid email");

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error("Invalid password");

  const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return {
    token,
    user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const changePasswordService = async (
  userId: number,
  oldPassword: string,
  newPassword: string
) => {
  const user = userRepo.getUserByIdRepo(userId) as User;
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isValid) throw new Error("Old password is incorrect");

  const newHash = await bcrypt.hash(newPassword, 10);
  const updated = authRepo.updatePasswordRepo(userId, newHash);
  if (!updated) throw new Error("Failed to update password");

  return true;
};

const forgotPasswordService = (email: string) => {
  const user = userRepo.getUserByEmailRepo(email) as User;
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  authRepo.createPasswordResetRepo(user.user_id!, token, expiresAt);

  // Have to setup -> node-mailer over here
  return {
    resetLink: `http://localhost:3000/api/auth/reset-password?token=${token}`,
  };
};

const resetPasswordService = (token: string, newPassword: string) => {
  const resetEntry = authRepo.findPasswordResetRepo(token);
  if (!resetEntry) throw new Error("Invalid or expired token");

  if (new Date(resetEntry.expires_at) < new Date()) {
    authRepo.deletePasswordResetRepo(token);
    throw new Error("Token expired");
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  authRepo.updatePasswordRepo(resetEntry.user_id, hashedPassword);

  authRepo.deletePasswordResetRepo(token);
  return { message: "Password reset successful" };
};

const authService = {
  registerService,
  loginService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
};

export default authService