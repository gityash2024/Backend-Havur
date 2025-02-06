import { model } from "mongoose";
import { patientCaseSchema } from "../../../models/patientCase";

export const PatientCase = model("PatientCase", patientCaseSchema);
