import { model } from "mongoose";
import { qualificationSchema } from "../../../models/qualification";

export const Qualification = model("Qualification", qualificationSchema);
