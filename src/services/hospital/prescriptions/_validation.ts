import Joi from "joi";
import { model } from "mongoose";
import { prescriptionsSchema } from "../../../models/prescription";
import { prescriptionsMedicinesSchema } from "../../../models/prescriptionsMedicines";

export const Prescriptions = model("Prescriptions", prescriptionsSchema);
export const PrescriptionsMedicines = model(
  "PrescriptionsMedicines",
  prescriptionsMedicinesSchema
);

export const validateDelete = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().label("ID"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
