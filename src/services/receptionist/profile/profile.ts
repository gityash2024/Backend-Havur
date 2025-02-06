import { Request, Response } from "express";
import { Users, validateUpdate } from "./_validation";
import { fileDelete, fileUpload } from "../../../helper/upload";
import _ from "lodash";

const usersView = async (users: any) => {
  users = _.pick(users, ["firstName", "lastName", "profile", "dob", "phone"]);
  return users;
};

export const view = async (req: Request, res: Response) => {
  let user: any = await Users.findOne({ _id: req.body.uid })
    .select({
      password: 0,
      otp: 0,
      status: 0,
    })
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 });
  if (!user) return res.status(400).json({ message: "No record found." });

  res.status(200).json({ data: user });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let user: any = await Users.findOne({ _id: req.body.uid });
  if (!user) return res.status(404).json({ message: "No record found." });

  user = _.assign(
    user,
    _.pick(req.body, ["firstName", "lastName", "profile", "dob", "phone"])
  );

  user.updatedAt = new Date().toISOString();
  user = await user.save();
  user = await usersView(user);

  res.status(200).json({ message: "Profile updated successfully." });
};

export const uploadFile = async (req: Request, res: Response) => {
  await fileUpload(req, res, async (err: any) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.body.filename)
      return res.status(400).json({ message: "Please select the file." });
    res.status(200).json({
      message: "File uploaded successfully.",
      data: {
        filename: req.body.filename,
      },
    });
  });
};

export const deleteFile = async (req: Request, res: Response) => {
  if (!req.body.filename || req.body.filename === "")
    return res.status(400).json({ message: "File is not selected." });

  const isDelete: any = await fileDelete(req.body.filename);
  if (!isDelete) {
    return res.status(404).json({ message: "No File Found" });
  }

  res.status(200).json({ message: "File deleted successfully." });
};
