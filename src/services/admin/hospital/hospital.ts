import { Request, Response } from "express";
import {
  Hospitals,
  validateAdd,
  validateDelete,
  validateView,
  validateUpdate,
} from "./_validation";
import _ from "lodash";
import { encrypt } from "../../../helper/encription";

const hospitalView = async (hospital: any) => {
  hospital = _.pick(hospital, [
    "name",
    "emailAddress",
    "mobileNumber",
    "description",
    "address",
    "location",
    "hours",
    "mrp",
    "discount",
    "total",
    "image",
    "logo",
    "type",
  ]);
  return hospital;
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
    let totalRecords: number = await Hospitals.find().countDocuments();
    result.totalRecords = totalRecords;
  }
  result.hospital = await Hospitals.find({ $and: [filter] })
    .select({ password: 0, verificationCode: 0 })
    .sort({ createdAt: -1, name: 1, emailAddress: 1, status: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let hospitalRecord: number = result.hospital.length;
  result.lastPage = hospitalRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateView(req.body);
  if (error) throw error;

  let hospital: any = await Hospitals.findOne({ _id: req.body.id });
  if (!hospital) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: { hospital: hospital },
  });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let hospital: any = new Hospitals(
    _.pick(req.body, [
      "name",
      "emailAddress",
      "mobileNumber",
      "description",
      "address",
      "location",
      "reviews",
      "image",
      "logo",
      "type",
      "doctors",
    ])
  );
  hospital.password = await encrypt(req.body.password);
  hospital.createdAt = new Date().toISOString();
  hospital.updatedAt = new Date().toISOString();
  hospital = await hospital.save();

  res.status(200).json({ message: "Hospital added successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let hospital = await Hospitals.findOne({ _id: req.body.id });
  if (!hospital) return res.status(400).json({ message: "No Data Found!" });

  await Hospitals.deleteOne({ _id: req.body.id });

  res.status(200).json({ message: "Hospital deleted successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let hospital: any = await Hospitals.findOne({ _id: req.body.hospitalId });
  if (!hospital) return res.status(404).json({ message: "No record found." });

  let hospitalMobile: any = await Hospitals.findOne({
    $and: [
      { mobileNumber: req.body.mobileNumber },
      { mobileNumber: { $ne: hospital.mobileNumber } },
    ],
  });
  if (hospitalMobile)
    return res
      .status(400)
      .json({ error: { mobileNumber: "Mobile No. is already exists." } });

  let hospitalEmail: any = await Hospitals.findOne({
    $and: [
      { emailAddress: req.body.emailAddress },
      { emailAddress: { $ne: hospital.emailAddress } },
    ],
  });
  if (hospitalEmail)
    return res
      .status(400)
      .json({ error: { mobileNumber: "Email Id  is already exists." } });

  hospital = _.assign(
    hospital,
    _.pick(req.body, [
      "name",
      "emailAddress",
      "mobileNumber",
      "description",
      "address",
      "location",
      "image",
      "logo",
      "type",
    ])
  );
  hospital.updatedAt = new Date().toISOString();
  hospital = await hospital.save();
  hospital = await hospitalView(hospital);

  res.status(200).json({ message: "Hospital updated successfully." });
};
