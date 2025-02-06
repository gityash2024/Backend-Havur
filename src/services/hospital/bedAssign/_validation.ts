import Joi from "joi";
import { model } from "mongoose";
import { bedAssignSchema } from "../../../models/bedAssign";

export const BedAssign = model("BedAssign", bedAssignSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    bed: Joi.string().hex().length(24).required().label("Bed"),
    case: Joi.string().hex().length(24).required().label("Case"),
    ipdPatient: Joi.string().hex().length(24).required().label("IPD Patient"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
