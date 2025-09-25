import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userRepo from "../repositories/sqlite/userRepo";
import authRepo from "../repositories/sqlite/authRepo";
import { User } from "../interfaces/userInterface";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

const register = async (
  name: string,
  email: string,
  password: string,
  is_blind = 0
) => {
  const existing = await userRepo.getUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const hash = await bcrypt.hash(password, 10);
  const user: User & { user_id: string } = await userRepo.createUser({
    name,
    email,
    password_hash: hash,
    role: "student",
    is_blind,
  });

  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const login = async (email: string, password: string) => {
  const user = (await userRepo.getUserByEmail(email)) as User & { user_id: string };
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

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = (await userRepo.getUserById(userId)) as User & { user_id: string };
  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isValid) throw new Error("Old password is incorrect");

  const newHash = await bcrypt.hash(newPassword, 10);
  const updated = await authRepo.updatePassword(userId, newHash);
  if (!updated) throw new Error("Failed to update password");

  return true;
};

const forgotPassword = async (email: string) => {
  const user = (await userRepo.getUserByEmail(email)) as User & { user_id: string };
  if (!user) throw new Error("User not found");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await authRepo.createPasswordReset(user.user_id, token, expiresAt);

  return {
    resetLink: `http://localhost:3000/api/auth/reset-password?token=${token}`,
  };
};

const resetPassword = async (token: string, newPassword: string) => {
  const resetEntry = await authRepo.findPasswordReset(token);
  if (!resetEntry) throw new Error("Invalid or expired token");

  if (new Date(resetEntry.expires_at) < new Date()) {
    await authRepo.deletePasswordReset(token);
    throw new Error("Token expired");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authRepo.updatePassword(resetEntry.user_id, hashedPassword);
  await authRepo.deletePasswordReset(token);

  return { message: "Password reset successful" };
};

const authService = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default authService;
