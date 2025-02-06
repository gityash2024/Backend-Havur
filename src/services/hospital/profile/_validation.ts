import { model } from "mongoose";
import Joi from 'joi';
import { hospitalSchema } from '../../../models/hospital';
import { doctorSchema } from '../../../models/doctor';

export const Hospitals = model('Hospitals', hospitalSchema);
export const Doctors = model('Doctors', doctorSchema);

export const validateView = (data: any) => {
    const schema = Joi.object({
        hid: Joi.string().hex().length(24).required().label('ID')
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateUpdate = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().required().label('Name'),
        emailAddress: Joi.string().required().email().label('Email address'),
        mobileNumber: Joi.string().required().label('Mobile Number'),
        address: Joi.string().required().label('Address'),
        location: Joi.string().required().label('Location'),
        hours: Joi.string().required().label('Hours'),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
