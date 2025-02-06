import { model } from "mongoose";
import { departmentSchema } from "../../../models/department";

export const Department = model("Department", departmentSchema);
