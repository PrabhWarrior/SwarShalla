import Joi from "./joi";

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string()
    .valid("student", "teacher", "admin")
    .optional()
    .default("student"),
  is_blind: Joi.number().default(0),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("student", "teacher", "admin").optional(),
  is_blind: Joi.boolean().optional(),
});

const userSchemma = {
  createUserSchema,
  updateUserSchema,
};
export default userSchemma;
