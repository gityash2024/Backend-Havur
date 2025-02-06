import { model } from "mongoose";
import Joi from 'joi';
import { doctorSchema } from "../../../models/doctor";
import { hospitalSchema } from "../../../models/hospital";


export const Doctor = model('Doctors', doctorSchema);
export const Hospital = model('Hospital',hospitalSchema);

export const validateJoinhospital = (data : any) => {
    const schema = Joi.object({
        hid: Joi.string().required().label('Hospital ID'),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
}

