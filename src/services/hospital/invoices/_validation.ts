import Joi from "joi";
import { model } from "mongoose";
import { invoiceSchema } from "../../../models/invoices";
import { invoiceItemSchema } from "../../../models/invoiceItems";

export const Invoices = model("Invoices", invoiceSchema);
export const InvoiceItems = model("InvoiceItems", invoiceItemSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    patientId: Joi.string().hex().length(24).required().label("Patient"),
    invoiceId: Joi.string().required().label("Invoice Id"),
    invoiceDate: Joi.string().required().label("Invoice Date"),
    amount: Joi.number().required().label("Amount"),
    discount: Joi.number().required().label("Discount"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
