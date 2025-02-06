import { model } from "mongoose";
import { bedTypeSchema } from "../../../models/bedType";

export const BedType = model("BedType", bedTypeSchema);
