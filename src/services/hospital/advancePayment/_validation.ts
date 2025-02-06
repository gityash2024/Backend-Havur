import Joi from "joi";
import { model } from "mongoose";
import { advancePaymentSchema } from "../../../models/advancePayment";

export const AdvancePayment = model("AdvancePayment", advancePaymentSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    paymentDate: Joi.string().required().label("Payment Date"),
    patientId: Joi.string().hex().length(24).required().label("Patient ID"),
    receiptNo: Joi.string().required().label("ReceiptNo"),
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
