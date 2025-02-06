import { model } from "mongoose";
import Joi from "joi";
import { patientCaseSchema } from "../../../models/patientCase";

export const PatientCase = model("PatientCase", patientCaseSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    patientId: Joi.string().hex().length(24).required().label("Patient ID"),
    doctorId: Joi.string().hex().length(24).required().label("Doctor ID"),
  });
  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
