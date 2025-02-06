import { Request, Response } from "express";
import { Holidays } from "./_validation";
import _ from "lodash";

export const add = async (req: Request, res: Response) => {
  let holidays: any = new Holidays(_.pick(req.body, ["notes"]));

  holidays.holidaydate = new Date(req.body.holidaydate).toISOString();
  holidays.doctorId = req.body.did;
  holidays.createdAt = new Date().toISOString();
  holidays.updatedAt = new Date().toISOString();
  holidays = await holidays.save();

  res.status(200).json({ message: "Holidays added successfully." });
};

export const list = async (req: Request, res: Response) => {
  const holidays = await Holidays.find({
    doctorId: req.body.did,
  })
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: holidays });
};

export const remove = async (req: Request, res: Response) => {
  let holidays = await Holidays.findOne({
    _id: req.body.id,
    doctorId: req.body.did,
  });
  if (!holidays) return res.status(400).json({ message: "No Data Found!" });

  await Holidays.deleteOne({ _id: req.body.id, doctorId: req.body.did });

  res.status(200).json({ message: "Holidays deleted successfully." });
};
