import userRepo from "../repositories/sqlite/userRepo";
import { User } from "../interfaces/userInterface";

const createUser = async (user: User) => {
  const created = await userRepo.createUser(user);
  const { password_hash, ...safeUser } = created;
  return safeUser;
};

const getUserByEmail = async (email: string) => {
  const user = await userRepo.getUserByEmail(email);
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const getUserById = async (id: number) => {
  const user = await userRepo.getUserById(id);
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

const getAllUsers = async () => {
  const users = await userRepo.getAllUsers();
  return users.map(({ password_hash, ...rest }) => rest);
};

const updateUser = async (id: number, data: Partial<User>) => {
  const updated = await userRepo.updateUser(id, data);
  if (!updated) return null;
  const { password_hash, ...safeUser } = updated;
  return safeUser;
};

const deleteUser = async (id: number) => {
  return await userRepo.deleteUser(id);
};

const userService = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};

export default userService;
