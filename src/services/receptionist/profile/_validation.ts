import { model } from "mongoose";
import Joi from "joi";
import { usersSchema } from "../../../models/users";

export const Users = model("Users", usersSchema);

export const validateUpdate = (data: any) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    dob: Joi.string().required().label("Date of birth"),
    phone: Joi.string().required().label("Phone"),
    profile: Joi.string().required().label("Profile"),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
