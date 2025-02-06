import { Request, Response } from "express";
import { Specialization } from "./_validation";
import _ from "lodash";

export const add = async (req: Request, res: Response) => {
  let specialization: any = await Specialization.findOne({
    name: req.body.name,
  });
  if (specialization)
    return res.status(400).json({ message: "Specialization already exist." });

  let speciality: any = new Specialization(_.pick(req.body, ["name"]));

  speciality.createdAt = new Date().toISOString();
  speciality.updatedAt = new Date().toISOString();
  speciality = await speciality.save();

  res.status(200).json({ message: "Specialization added successfully." });
};

export const list = async (req: Request, res: Response) => {
  const specialization = await Specialization.find()
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: specialization });
};
