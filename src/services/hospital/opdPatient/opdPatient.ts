import { Request, Response } from "express";
import { OpdPatient, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";
import generateAutoID from "./../../../helper/autoGenerate";

const opdPatientView = async (opdPatient: any) => {
  opdPatient = _.pick(opdPatient, [
    "patientId",
    "caseId",
    "doctorId",
    "opdNo",
    "weight",
    "height",
    "bloodPressure",
    "appointmentDate",
    "doctorOpdCharge",
    "paymentMode",
    "symptoms",
    "notes",
    "history",
    "status",
  ]);
  return opdPatient;
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await OpdPatient.find({
      hospitalId: req.body.hid,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.opdPatient = await OpdPatient.find({
    hospitalId: req.body.hid,
    status: true,
  })
    .populate("patientId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailAddress: 1,
      gender: 1,
      birthDate: 1,
    })
    .populate("doctorId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailId: 1,
    })
    .populate("caseId", {
      caseId: 1,
      caseDate: 1,
      phone: 1,
      fee: 1,
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let opdPatientRecord: number = result.opdPatient.length;
  result.lastPage = opdPatientRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let patientExist: any = await OpdPatient.findOne({
    patientId: req.body.patientId,
    hospitalId: req.body.hid,
  });
  if (patientExist)
    return res.status(400).json({ message: "Patient already exist." });

  let opdPatient: any = new OpdPatient(
    _.pick(req.body, [
      "patientId",
      "caseId",
      "doctorId",
      "weight",
      "height",
      "bloodPressure",
      "appointmentDate",
      "doctorOpdCharge",
      "paymentMode",
      "symptoms",
      "notes",
      "history",
      "status",
    ])
  );

  opdPatient.opdNo = generateAutoID(8);
  opdPatient.hospitalId = req.body.hid;
  opdPatient.createdAt = new Date().toISOString();
  opdPatient.updatedAt = new Date().toISOString();
  opdPatient = await opdPatient.save();

  res.status(200).json({ message: "OPD patient added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let opdPatient: any = await OpdPatient.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!opdPatient)
    return res.status(400).json({ message: "No patient found." });
  if (opdPatient.patientId === req.body.patientId)
    return res.status(400).json({ message: "OPD patient already exist." });

  opdPatient = _.assign(
    opdPatient,
    _.pick(req.body, [
      "patientId",
      "caseId",
      "doctorId",
      "weight",
      "height",
      "bloodPressure",
      "appointmentDate",
      "doctorOpdCharge",
      "paymentMode",
      "symptoms",
      "notes",
      "history",
      "status",
    ])
  );

  opdPatient.updatedAt = new Date().toISOString();
  opdPatient = await opdPatient.save();
  opdPatient = await opdPatientView(opdPatient);

  res.status(200).json({ message: "OPD patient updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let opdPatient = await OpdPatient.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!opdPatient) return res.status(400).json({ message: "No Data Found!" });

  await OpdPatient.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "OPD patient deleted successfully." });
};
