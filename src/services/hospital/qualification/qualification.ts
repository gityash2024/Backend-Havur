import { Request, Response } from "express";
import { Qualification } from "./_validation";
import _ from "lodash";

export const add = async (req: Request, res: Response) => {
  let qualification: any = await Qualification.findOne({
    name: req.body.name,
  });
  if (qualification)
    return res.status(400).json({ message: "Qualification already exist." });

  let qualifications: any = new Qualification(_.pick(req.body, ["name"]));

  qualifications.createdAt = new Date().toISOString();
  qualifications.updatedAt = new Date().toISOString();
  qualifications = await qualifications.save();

  res.status(200).json({ message: "Qualification added successfully." });
};

export const list = async (req: Request, res: Response) => {
  const qualification = await Qualification.find()
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: qualification });
};
