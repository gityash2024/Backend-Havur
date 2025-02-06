import { Request, Response } from "express";
import { Patient, validateAdd } from "./_validation";
import _ from "lodash";
import { encrypt } from "../../../helper/encription";

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;
  if (req.body.password != req.body.confirmPassword)
    return res
      .status(400)
      .json({ message: "Password and Confirm Password should be same" });

  const emailExist = await Patient.findOne({
    emailAddress: req.body.emailAddress,
  });
  if (emailExist)
    return res.status(400).json({ message: "Email already exists." });

  const mobileExist = await Patient.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (mobileExist)
    return res.status(400).json({ message: "Mobile Number already exists." });

  let patient: any = new Patient(
    _.pick(req.body, [
      "firstName",
      "middleName",
      "lastName",
      "birthDate",
      "age",
      "gender",
      "wedding",
      "language",
      "religion",
      "weight",
      "height",
      "maritialStatus",
      "emailAddress",
      "estimate",
      "aadharNo",
      "panNo",
      "memberShipId",
      "employeeId",
      "occupation",
      "spouseOccupation",
      "companyName",
      "education",
      "mediclaim",
      "mobileNumber",
      "photo",
      "remark",
    ])
  );
  patient.birthDate = new Date(req.body.birthDate).toISOString();
  patient.password = await encrypt(req.body.password);
  patient.address.address = req.body.address;
  patient.address.area = req.body.area;
  patient.address.state = req.body.state;
  patient.address.city = req.body.city;
  patient.communication.residence = req.body.residence;
  patient.communication.office = req.body.office;
  patient.communication.other = req.body.other;
  patient.createdAt = new Date().toISOString();
  patient.updatedAt = new Date().toISOString();
  patient.status = "success";
  patient = await patient.save();

  res.status(200).json({ message: "patient added successfully." });
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 40;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.firstName) {
    filter["firstName"] = req.body.firstName;
  }
  if (req.body.lastName) {
    filter["lastName"] = req.body.lastName;
  }
  if (req.body.middleName) {
    filter["middleName"] = req.body.middleName;
  }
  if (req.body.emailAddress) {
    filter["emailAddress"] = req.body.emailAddress;
  }
  if (req.body.mobileNumber) {
    filter["mobileNumber"] = req.body.mobileNumber;
  }
  if (req.body.gender) {
    filter["gender"] = req.body.gender;
  }

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Patient.find({
      $and: [filter],
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.patient = await Patient.find({ $and: [filter] })
    .select({ password: 0, status: 0, verificationCode: 0, mFile: 0 })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let patientRecord: number = result.patient.length;
  result.lastPage = patientRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};
