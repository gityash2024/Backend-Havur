import Joi from "joi";
import { appointmentSchema } from "../../../models/appointment";
import { model } from "mongoose";
import { appointmentTransactionsSchema } from "../../../models/appointmentTransaction";
import { doctorSchema } from "../../../models/doctor";

export const Appointment = model("Appointment", appointmentSchema);
export const AppointmentTransaction = model(
  "AppointmentTransaction",
  appointmentTransactionsSchema
);
export const Doctor = model("Doctor", doctorSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    doctorId: Joi.string().hex().length(24).label("Doctor ID"),
    hospitalId: Joi.string().hex().length(24).label("Hospital ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateView = (data: any) => {
  const schema = Joi.object({
    aid: Joi.string().hex().length(24).label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
