import Joi from "joi";
import { appointmentSchema } from "../../../models/appointment";
import { model } from "mongoose";

export const Appointment = model("Appointment", appointmentSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    doctorId: Joi.string().hex().length(24).label("Doctor ID"),
    patientId: Joi.string().hex().length(24).label("Patient ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateView = (data: any) => {
  const schema = Joi.object({
    aid: Joi.string().hex().length(24).label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
