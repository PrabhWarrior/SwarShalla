import Joi from "./joi";

const register = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string()
    .valid("student", "teacher", "admin")
    .optional()
    .default("student"),
  is_blind: Joi.number().default(0),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePassword = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassword = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const authSchema = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
};
export default authSchema;
