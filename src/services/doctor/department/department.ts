import { Request, Response } from "express";
import { Department } from "./_validation";
import _ from "lodash";

export const add = async (req: Request, res: Response) => {
  let department: any = await Department.findOne({
    name: req.body.name,
  });
  if (department)
    return res.status(400).json({ message: "Department already exist." });

  let departments: any = new Department(_.pick(req.body, ["name"]));

  departments.createdAt = new Date().toISOString();
  departments.updatedAt = new Date().toISOString();
  departments = await departments.save();

  res.status(200).json({ message: "Department added successfully." });
};

export const list = async (req: Request, res: Response) => {
  const department = await Department.find()
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: department });
};
