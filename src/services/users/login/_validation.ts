import { model } from "mongoose";
import { patientSchema } from "../../../models/patient";
import Joi from "joi";

export const Patient = model("Patients", patientSchema);

export const validateSignup = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    emailAddress: Joi.string().required().email().label("Email Address"),
    password: Joi.string().required().label("Password"),
    mobileNumber: Joi.string().required().label("Mobile Number"),
    gender: Joi.string().required().label("Gender"),
    birthDate: Joi.string().required().label("Date of Birth"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    emailAddress: Joi.string().required().email().label("Email Address"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateLoginWithMobile = (data: any) => {
  const schema = Joi.object({
    mobileNumber: Joi.string().required().label("Mobile Number"),
    verificationCode: Joi.string().required().label("Verification Code"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateVerify = (data: any) => {
  const schema = Joi.object({
    emailAddress: Joi.string().required().email().label("Email Address"),
    verificationCode: Joi.string().required().label("Verification Code"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateNobile = (data: any) => {
  const schema = Joi.object({
    mobileNumber: Joi.string().required().label("Mobile Number"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateEmail = (data: any) => {
  const schema = Joi.object({
    emailAddress: Joi.string().email().required().label("Email Address"),
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
