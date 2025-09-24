import { openSqliteDb } from "../../config/db";
import { User } from "../../interfaces/userInterface";

const createUser = async (user: User): Promise<User & { user_id: number }> => {
  const db = await openSqliteDb();
  const result = await db.run(
    `INSERT INTO users (name, email, password_hash, role, is_blind)
     VALUES (?, ?, ?, ?, ?)`,
    user.name,
    user.email,
    user.password_hash,
    user.role ?? "student",
    user.is_blind ? 1 : 0
  );

  if (result.lastID === undefined) {
    throw new Error("Failed to retrieve last inserted ID for user");
  }

  return { ...user, user_id: result.lastID };
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const db = await openSqliteDb();
  const row = await db.get(`SELECT * FROM users WHERE email = ?`, email);
  return row as User | undefined;
};

const getUserById = async (id: number): Promise<User | undefined> => {
  const db = await openSqliteDb();
  const row = await db.get(`SELECT * FROM users WHERE user_id = ?`, id);
  return row as User | undefined;
};

const getAllUsers = async (): Promise<User[]> => {
  const db = await openSqliteDb();
  const rows = await db.all(`SELECT * FROM users`);
  return rows as User[];
};

const updateUser = async (
  id: number,
  data: Partial<User>
): Promise<User | null> => {
  const db = await openSqliteDb();
  const user = await getUserById(id);
  if (!user) return null;

  await db.run(
    `UPDATE users SET name = ?, email = ?, role = ?, is_blind = ? WHERE user_id = ?`,
    data.name ?? user.name,
    data.email ?? user.email,
    data.role ?? user.role,
    typeof data.is_blind === "boolean"
      ? data.is_blind
        ? 1
        : 0
      : user.is_blind,
    id
  );

  const updatedUser = await getUserById(id);
  return updatedUser === undefined ? null : updatedUser;
};

const deleteUser = async (id: number): Promise<boolean> => {
  const db = await openSqliteDb();
  const result = await db.run(`DELETE FROM users WHERE user_id = ?`, id);
  return !!result.changes;
};

const userRepo = {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};

export default userRepo;
