import { model } from "mongoose";
import Joi from "joi";
import { doctorSchema } from "../../../models/doctor";

export const Doctor = model("Doctors", doctorSchema);
export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    qualification: Joi.string().required().label("Qualification"),
    specialization: Joi.string().required().label("Specialization"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
