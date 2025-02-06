import { Request, Response } from "express";
import {
  Users,
  validateAdd,
  validateDelete,
  validateUpdate,
} from "./_validation";
import _ from "lodash";
import { encrypt } from "../../../helper/encription";

const usersView = async (user: any) => {
  user = _.pick(user, [
    "firstName",
    "lastName",
    "profile",
    "dob",
    "phone",
    "hospitalId",
    "email",
    "password",
    "gender",
    "role",
  ]);
  return user;
};

export const list = async (req: Request, res: Response) => {
  let result: any = {};

  let totalRecords: number = await Users.find({
    hospitalId: req.body.hid,
    status: true,
  }).countDocuments();

  result.totalRecords = totalRecords;
  result.receptionist = await Users.find({
    hospitalId: req.body.hid,
    status: true,
  })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let userExist: any = await Users.findOne({
    email: req.body.email,
  });
  if (userExist)
    return res.status(400).json({ message: "Email already exist." });

  let user: any = new Users(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "profile",
      "dob",
      "phone",
      "email",
      "gender",
      "role",
    ])
  );

  user.password = await encrypt(req.body.password);
  user.hospitalId = req.body.hid;
  user.createdAt = new Date().toISOString();
  user.updatedAt = new Date().toISOString();
  user = await user.save();

  res.status(200).json({ message: "Receptionist added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let user: any = await Users.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!user) return res.status(400).json({ message: "No record found." });

  let emailExist: any = await Users.findOne({
    $ne: { _id: req.body.id },
    email: req.body.email,
    hospitalId: req.body.hid,
  });
  if (!emailExist)
    return res.status(400).json({ message: "Email already exist." });

  user = _.assign(
    user,
    _.pick(req.body, [
      "firstName",
      "lastName",
      "profile",
      "dob",
      "phone",
      "email",
      "gender",
      "role",
    ])
  );

  user.hospitalId = req.body.hid;
  user.updatedAt = new Date().toISOString();
  user = await user.save();
  user = await usersView(user);

  res.status(200).json({ message: "Receptionist updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let user = await Users.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!user) return res.status(400).json({ message: "No Data Found!" });

  await Users.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Receptionist deleted successfully." });
};
