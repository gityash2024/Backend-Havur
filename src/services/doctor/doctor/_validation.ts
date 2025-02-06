import { model } from "mongoose";
import { doctorSchema } from "../../../models/doctor";

export const Doctors = model("Doctors", doctorSchema);
