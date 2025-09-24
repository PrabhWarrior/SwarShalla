import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { defaultValidationOptions } from "../validators/joi";
import { sendError } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";
const validate =
  (schema: ObjectSchema, property: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(
      req[property],
      defaultValidationOptions
    );

    if (error) {
      return sendError(
        res,
        error.details.map((d) => d.message),
        StatusCodes.BAD_REQUEST
      );
    }

    req[property] = value;
    next();
  };

export default validate;
