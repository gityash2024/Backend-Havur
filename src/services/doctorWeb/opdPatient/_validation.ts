import Joi from "joi";
import { model } from "mongoose";
import { opdPatientSchema } from "../../../models/opdPatient";

export const OpdPatient = model("OpdPatient", opdPatientSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    patientId: Joi.string().hex().length(24).required().label("Patient ID"),
    hospitalId: Joi.string().hex().length(24).required().label("Hospital ID"),
    caseId: Joi.string().hex().length(24).required().label("Case ID"),
    appointmentDate: Joi.string().required().label("Appointment Date"),
    doctorOpdCharge: Joi.number().required().label("Doctor OPD Charge"),
    paymentMode: Joi.string().required().label("Payment Mode"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
