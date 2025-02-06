import Joi from "joi";
import { model } from "mongoose";
import { ipdPatientSchema } from "../../../models/ipdPatient";

export const IpdPatient = model("IpdPatient", ipdPatientSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    patientId: Joi.string().hex().length(24).required().label("Patient ID"),
    hospitalId: Joi.string().hex().length(24).required().label("Hospital ID"),
    caseId: Joi.string().hex().length(24).required().label("Case ID"),
    bed: Joi.string().hex().length(24).required().label("Bed"),
    bedType: Joi.string().hex().length(24).required().label("Bed Type"),
    admissionDate: Joi.string().required().label("Admission Date"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
