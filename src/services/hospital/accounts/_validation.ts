import Joi from "joi";
import { model } from "mongoose";
import { accountsSchema } from "../../../models/accounts";

export const Accounts = model("Accounts", accountsSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    type: Joi.string().required().label("Type"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    type: Joi.string().required().label("Type"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
