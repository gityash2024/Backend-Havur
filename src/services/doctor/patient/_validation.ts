import { model } from "mongoose";
import Joi from "joi";
import { patientSchema } from "../../../models/patient";

export const Patient = model("Patient", patientSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    emailAddress: Joi.string().required().email().label("Email Address"),
    password: Joi.string().required().label("Password"),
    confirmPassword: Joi.string().required().label("Confirm Password"),
    mobileNumber: Joi.string().required().label("Mobile Number"),
    gender: Joi.string().required().label("Gender"),
    birthDate: Joi.string().required().label("Date of Birth"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
