import { model } from "mongoose";
import { appointmentSchema } from '../../../models/appointment';
import { patientSchema } from '../../../models/patient';
import Joi from 'joi';

export const Appointment = model('Appointment', appointmentSchema);
export const Patients = model('Patient',patientSchema);

export const validateView = (data : any) => {
    const schema = Joi.object({
        aid: Joi.string().required().label('Appointment ID'),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
}
export const validateUpdate = (data: any) => {
    const schema = Joi.object({
        pid: Joi.string().required().label('Patient ID'),
        uploadFile : Joi.string().required().label('Upload File URL needed')
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
export const validateUpload = (data: any) => {
    const schema = Joi.object({
        pid: Joi.string().required().label('Patient ID'),
    });

    return schema.validate(data, { abortEarly: false, allowUnknown: true });
};