import { model } from "mongoose";
import Joi from "joi";
import { doctorSchema } from "../../../models/doctor";
import { hospitalSchema } from "../../../models/hospital";

export const Doctors = model("Doctors", doctorSchema);
export const Hospitals = model("Hospitals", hospitalSchema);

export const validateAcceptdoctor = (data: any) => {
  const schema = Joi.object({
    did: Joi.string().required().label("Doctor ID"),
  });
  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
export const validateAdd = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    department: Joi.string().required().label("Department"),
    email: Joi.string().required().email().label("Email Id"),
    mobileNumber: Joi.string().required().label("Mobile Number"),
    designation: Joi.string().required().label("Designation"),
    qualification: Joi.string().required().label("Qualification"),
    specialization: Joi.string().required().label("Specialization"),
    password: Joi.string().required().label("Password"),
    confirmPassword: Joi.string().required().label("confirmPassword"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
