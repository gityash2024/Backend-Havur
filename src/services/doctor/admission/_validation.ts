import Joi from "joi";
import { admissionSchema } from "../../../models/admission";
import { doctorSchema } from "../../../models/doctor";
import { patientSchema } from "../../../models/patient";

import { model } from "mongoose";

export const Admission = model("Admission", admissionSchema);
export const Doctor = model("Doctor", doctorSchema);
export const Patient = model("Patient", patientSchema);

export const validateAdd = (data: any) => {
  const schema = Joi.object({
    hospitalId: Joi.string().hex().required().length(24).label("Hospital ID"),
    patientId: Joi.string().hex().required().length(24).label("Patient ID"),
    admissionDate: Joi.string().required().label("Admission Date"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
