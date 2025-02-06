import { Request, Response } from "express";
import { IpdPatient, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";
import generateAutoID from "./../../../helper/autoGenerate";

const ipdPatientView = async (ipdPatient: any) => {
  ipdPatient = _.pick(ipdPatient, [
    "patientId",
    "caseId",
    "hospitalId",
    "weight",
    "height",
    "bloodPressure",
    "admissionDate",
    "bed",
    "bedType",
    "symptoms",
    "billStatus",
    "notes",
  ]);
  return ipdPatient;
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await IpdPatient.find({
      doctorId: req.body.did,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.ipdPatient = await IpdPatient.find({
    doctorId: req.body.did,
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
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
    .populate("caseId", {
      caseId: 1,
      caseDate: 1,
      phone: 1,
      fee: 1,
    })
    .populate("bed", {
      bedId: 1,
      name: 1,
      available: 1,
    })
    .populate("bedType", {
      bedType: 1,
      description: 1,
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let ipdPatientRecord: number = result.ipdPatient.length;
  result.lastPage = ipdPatientRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let patientExist: any = await IpdPatient.findOne({
    patientId: req.body.patientId,
    doctorId: req.body.did,
  });
  if (patientExist)
    return res.status(400).json({ message: "Patient already exist." });

  let opdPatient: any = new IpdPatient(
    _.pick(req.body, [
      "patientId",
      "caseId",
      "hospitalId",
      "weight",
      "height",
      "bloodPressure",
      "bed",
      "bedType",
      "symptoms",
      "billStatus",
      "notes",
    ])
  );

  opdPatient.ipdNo = generateAutoID(8);
  opdPatient.doctorId = req.body.did;
  opdPatient.admissionDate = new Date(req.body.admissionDate).toISOString();
  opdPatient.createdAt = new Date().toISOString();
  opdPatient.updatedAt = new Date().toISOString();
  opdPatient = await opdPatient.save();

  res.status(200).json({ message: "IPD patient added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let ipdPatient: any = await IpdPatient.findOne({
    _id: req.body.id,
    doctorId: req.body.did,
  });
  if (!ipdPatient)
    return res.status(400).json({ message: "No patient found." });
  if (ipdPatient.patientId === req.body.patientId)
    return res.status(400).json({ message: "IPD patient already exist." });

  ipdPatient = _.assign(
    ipdPatient,
    _.pick(req.body, [
      "patientId",
      "caseId",
      "hospitalId",
      "weight",
      "height",
      "bloodPressure",
      "bed",
      "bedType",
      "symptoms",
      "billStatus",
      "notes",
    ])
  );

  ipdPatient.admissionDate = new Date(req.body.admissionDate).toISOString();
  ipdPatient.updatedAt = new Date().toISOString();
  ipdPatient = await ipdPatient.save();
  ipdPatient = await ipdPatientView(ipdPatient);

  res.status(200).json({ message: "IPD patient updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let ipdPatient = await IpdPatient.findOne({
    _id: req.body.id,
    doctorId: req.body.did,
  });
  if (!ipdPatient) return res.status(400).json({ message: "No Data Found!" });

  await IpdPatient.deleteOne({ _id: req.body.id, doctorId: req.body.did });

  res.status(200).json({ message: "IPD patient deleted successfully." });
};
