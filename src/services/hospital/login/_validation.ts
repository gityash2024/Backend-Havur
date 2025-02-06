import { model } from "mongoose";
import { hospitalSchema } from "../../../models/hospital";
import Joi from 'joi';

export const Hospital = model('Hospitals', hospitalSchema);


export const validateLogin = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().required().label('User Name'),
        password: Joi.string().required().label('Password'),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateEmail = (data: any) => {
    const schema = Joi.object({
        emailAddress: Joi.string().required().label('Email Address')
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};

export const validateResetPassword = (data: any) => {
    const schema = Joi.object({
        verificationCode: Joi.string().required().label('Verification Code'),
        password: Joi.string().required().label('Password')
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};