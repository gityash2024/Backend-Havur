import { model } from "mongoose";
import { bedSchema } from "../../../models/bed";

export const Bed = model("Bed", bedSchema);
