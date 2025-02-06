import { model } from "mongoose";
import Joi from 'joi';
import { hospitalSchema } from '../../../models/hospital';
import { doctorSchema } from '../../../models/doctor';

export const Hospital = model('Hospital', hospitalSchema);
export const Doctor = model('Doctors', doctorSchema);

export const validateView = (data: any) => {
    const schema = Joi.object({
        hid: Joi.string().hex().length(24).required().label('ID')
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};


