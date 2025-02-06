import { Request, Response } from "express";
import { Schedule } from "./_validation";
import _ from "lodash";

export const add = async (req: Request, res: Response) => {
  let schedule: any = new Schedule(
    _.pick(req.body, [
      "patientPerTime",
      "day",
      "availableFrom",
      "availableTo",
      "hospitalId",
    ])
  );

  schedule.doctorId = req.body.did;
  schedule.createdAt = new Date().toISOString();
  schedule.updatedAt = new Date().toISOString();
  schedule = await schedule.save();

  res.status(200).json({ message: "Schedule added successfully." });
};

export const list = async (req: Request, res: Response) => {
  const schedule = await Schedule.find({
    hospitalId: req.body.hospitalId,
    doctorId: req.body.did,
  })
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: schedule });
};

export const update = async (req: Request, res: Response) => {
  let schedules: any = await Schedule.findOne({ _id: req.body.id });
  if (!schedules) return res.status(404).json({ message: "No record found." });

  schedules = _.assign(
    schedules,
    _.pick(req.body, ["hospitalId", "patientPerTime", "shifts"])
  );

  schedules.scheduleDate = new Date(req.body.scheduleDate).toISOString();
  schedules.doctorId = req.body.did;
  schedules.updatedAt = new Date().toISOString();
  schedules = await schedules.save();

  res.status(200).json({ message: "Schedule updated successfully." });
};

export const addSchedule = async (req: Request, res: Response) => {
  const existingSchedule = await Schedule.findOne({
    doctorId: req.body.did,
    hospitalId: req.body.hospitalId,
    scheduleDate: req.body.scheduleDate,
  });

  if (existingSchedule) {
    return res.status(400).json({
      message: "A schedule already exists for this doctor, hospital, and date.",
    });
  }
  const scheduleData = _.pick(req.body, [
    "hospitalId",
    "patientPerTime",
    "shifts",
  ]);

  // Check if a schedule already exists for the given doctorId, hospitalId, and scheduleDate

  const schedule = new Schedule({
    ...scheduleData,
    scheduleDate: new Date(req.body.scheduleDate).toISOString(),
    doctorId: req.body.did,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await schedule.save();

  res.status(200).json({ message: "Schedule added successfully." });
};
