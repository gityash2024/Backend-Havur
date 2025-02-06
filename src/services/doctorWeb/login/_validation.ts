import { model } from "mongoose";
import { doctorSchema } from "../../../models/doctor";
import Joi from "joi";

export const Doctor = model("Doctors", doctorSchema);

export const validateMobile = (data: any) => {
  const schema = Joi.object({
    mobileNumber: Joi.string().required().label("Mobile Number"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
export const validateEmail = (data: any) => {
  const schema = Joi.object({
    emailId: Joi.string().email().required().label("Email ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
export const validateVerify = (data: any) => {
  const schema = Joi.object({
    mobileNumber: Joi.string().required().label("Mobile Number"),
    verificationCode: Joi.string().required().label("Verification Code"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Mobile or Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateResetPassword = (data: any) => {
  const schema = Joi.object({
    verificationCode: Joi.string().required().label("Verification Code"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
