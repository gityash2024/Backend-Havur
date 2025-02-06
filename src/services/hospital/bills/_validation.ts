import Joi from "joi";
import { model } from "mongoose";
import { billsSchema } from "../../../models/bills";
import { billItemsSchema } from "../../../models/billItems";
import { billTransactionSchema } from "../../../models/billTransaction";

export const Bills = model("Bills", billsSchema);
export const BillItems = model("BillItems", billItemsSchema);
export const BillTransaction = model("BillTransaction", billTransactionSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    patientId: Joi.string().hex().length(24).required().label("Patient"),
    patientAdmissionId: Joi.string()
      .hex()
      .length(24)
      .required()
      .label("Admission"),
    billDate: Joi.string().required().label("Bill Date"),
    amount: Joi.number().required().label("Amount"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
