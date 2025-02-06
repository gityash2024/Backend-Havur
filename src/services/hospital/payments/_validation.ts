import Joi from "joi";
import { model } from "mongoose";
import { paymentSchema } from "../../../models/payment";

export const Payments = model("Payments", paymentSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    paymentDate: Joi.string().required().label("Payment Date"),
    accountId: Joi.string().hex().length(24).required().label("Account ID"),
    payTo: Joi.string().required().label("Pay To"),
    amount: Joi.string().required().label("Amount"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
