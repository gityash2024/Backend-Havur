import { model } from "mongoose";
import { appointmentTransactionsSchema } from "../../../models/appointmentTransaction";

export const AppointmentTransaction = model(
  "AppointmentTransaction",
  appointmentTransactionsSchema
);
