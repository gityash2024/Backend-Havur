import { model } from "mongoose";
import { specializationSchema } from "../../../models/specialization";

export const Specialization = model("Specialization", specializationSchema);
