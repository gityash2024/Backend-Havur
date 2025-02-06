import Joi from "joi";
import { model } from "mongoose";
import { bedTypeSchema } from "../../../models/bedType";

export const BedType = model("BedType", bedTypeSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    bedType: Joi.string().required().label("Bed Type"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
