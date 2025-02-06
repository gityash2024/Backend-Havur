import { model } from "mongoose";
import Joi from 'joi';
import { patientSchema } from "../../../models/patient";

export const Patients = model('Patients', patientSchema);

export const validateUpdate = (data: any) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label('First Name'),
        middleName: Joi.string().required().label('Middle Name'),
        lastName: Joi.string().required().label('Last Name'),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};