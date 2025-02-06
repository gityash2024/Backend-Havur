import Joi from "joi";
import { model } from "mongoose";
import { bedSchema } from "../../../models/bed";

export const Bed = model("Bed", bedSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    bedType: Joi.string().hex().length(24).required().label("Bed Type"),
    name: Joi.string().required().label("name"),
    charge: Joi.string().required().label("Charge"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
