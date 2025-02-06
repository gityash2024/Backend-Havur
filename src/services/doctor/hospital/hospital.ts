import { Request, Response } from "express";
import { Doctor, Hospital, validateJoinhospital } from "./_validation";
import _ from "lodash";
import mongoose from "mongoose";

export const joinHospital = async (req: Request, res: Response) => {
  const { error } = validateJoinhospital(req.body);
  if (error) throw error;
  let hospital: any = await Hospital.findOne({ _id: req.body.hid }).select({
    password: 0,
    verificationCode: 0,
    status: 0,
  });
  if (!hospital) return res.status(400).json({ message: "No record found." });

  const newHospital = {
    _id: req.body.hid,
  };
  let doctor: any = await Doctor.findOne({ _id: req.body.did });
  if (
    !doctor.hospitalId.some(
      (hospital: any) =>
        hospital._id === new mongoose.Types.ObjectId(req.body.hid)
    )
  ) {
    doctor.hospitalId.push(newHospital);
    await doctor.save();
    res.status(200).json({ message: "Request to Hospital Successfully" });
  } else {
    return res.status(400).json({ message: "Hospital Requested already..." });
  }
};

export const associatedHospitals = async (req: Request, res: Response) => {
  let doctor: any = await Doctor.findOne({ _id: req.body.did });
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.name) {
    filter["name"] = req.body.name;
  }
  if (req.body.emailAddress) {
    filter["emailAddress"] = req.body.emailAddress;
  }
  if (req.body.mobileNumber) {
    filter["mobileNumber"] = req.body.mobileNumber;
  }
  if (req.body.location) {
    filter["location"] = req.body.location;
  }
  let result: any = {};

  const hospitalIds = doctor.hospitalId.map(
    (hospital: { _id: any }) => hospital._id
  );
  result.hospital = await Hospital.find({
    _id: { $in: hospitalIds },
    $and: [filter],
  })
    .select({ password: 0, verificationCode: 0 })
    .sort({ name: 1, emailAddress: 1, status: 1 })
    .skip(skip)
    .limit(limit)
    .lean();
  if (pageNo === 1) {
    let totalRecords: number = await Hospital.find({
      _id: { $in: hospitalIds },
      $and: [filter],
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  let hospitalRecord: number = result.hospital.length;
  result.lastPage = hospitalRecord <= recordPerPage ? true : false;

  res.status(200).json({
    data: result,
  });
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.name) {
    filter["name"] = req.body.name;
  }
  if (req.body.emailAddress) {
    filter["emailAddress"] = req.body.emailAddress;
  }
  if (req.body.mobileNumber) {
    filter["mobileNumber"] = req.body.mobileNumber;
  }
  if (req.body.location) {
    filter["location"] = req.body.location;
  }

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Hospital.find({
      $and: [filter],
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.hospital = await Hospital.find({ $and: [filter] })
    .select({ password: 0, verificationCode: 0 })
    .sort({ name: 1, emailAddress: 1, status: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let hospitalRecord: number = result.hospital.length;
  result.lastPage = hospitalRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};
