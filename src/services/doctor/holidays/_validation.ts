import { model } from "mongoose";
import { holidaySchema } from "../../../models/doctorHolidays";

export const Holidays = model("Holidays", holidaySchema);
