import Joi from "joi";

import { model } from "mongoose";
import { tokenNoSchema } from "../../../models/tokenNo";
import { appointmentSchema } from "../../../models/appointment";

export const TokenNo = model("TokenNo", tokenNoSchema);
export const Appointment = model("Appointment", appointmentSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    hospitalId: Joi.string().hex().required().length(24).label("Hospital ID"),
    tokenNo: Joi.number().required().label("Token No"),
    date: Joi.string().required().label("Admission Date"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
