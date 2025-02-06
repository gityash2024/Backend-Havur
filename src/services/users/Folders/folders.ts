import { Request, Response } from "express";
import { Folders } from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  let folder = await Folders.find({
    patientId: req.body.pid,
  })
    .sort({ _id: -1 }) // Or another field that defines the latest record
    .lean();

  res.status(200).json({ data: folder });
};

export const add = async (req: Request, res: Response) => {
  let folderExists: any = await Folders.findOne({
    patientId: req.body.pid,
    name: req.body.name,
  });
  if (folderExists)
    return res.status(400).json({ message: "Folder already exist." });

  let folders: any = new Folders(_.pick(req.body, ["name"]));

  folders.patientId = req.body.pid;
  folders.createdAt = new Date().toISOString();
  folders.updatedAt = new Date().toISOString();
  folders = await folders.save();

  res.status(200).json({ message: "Folder added successfully." });
};
