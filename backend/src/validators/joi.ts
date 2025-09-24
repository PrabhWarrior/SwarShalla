import Joi, { ValidationOptions } from "joi";

export const defaultValidationOptions: ValidationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: true,
};

export default Joi;
