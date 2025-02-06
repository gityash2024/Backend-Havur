import { model } from "mongoose";
import { usersSchema } from "../../../models/users";
import Joi from "joi";

export const Users = model("Users", usersSchema);

export const validateEmail = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
export const validateVerify = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email"),
    otp: Joi.string().required().label("Otp"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateResetPassword = (data: any) => {
  const schema = Joi.object({
    otp: Joi.string().required().label("Otp"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
