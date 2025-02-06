import { Request, Response } from "express";
import { PatientCase, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";
import generateAutoID from "./../../../helper/autoGenerate";

const caseView = async (patientCase: any) => {
  patientCase = _.pick(patientCase, [
    "caseId",
    "patientId",
    "doctorId",
    "caseDate",
    "phone",
    "fee",
    "description",
    "status",
  ]);
  return patientCase;
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await PatientCase.find({
      hospitalId: req.body.hid,
      $and: [filter],
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.patientCase = await PatientCase.find({
    hospitalId: req.body.hid,
    $and: [filter],
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
      email: 1,
    })
    .select({
      status: 0,
      hospitalId: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let patientCaseRecord: number = result.patientCase.length;
  result.lastPage = patientCaseRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let patientCase: any = new PatientCase(
    _.pick(req.body, ["patientId", "doctorId", "phone", "fee", "description"])
  );

  patientCase.caseId = generateAutoID(8);
  patientCase.hospitalId = req.body.hid;
  patientCase.caseDate = new Date(req.body.caseDate).toISOString();
  patientCase.createdAt = new Date().toISOString();
  patientCase.updatedAt = new Date().toISOString();
  patientCase = await patientCase.save();

  res.status(200).json({ message: "Case added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let patientCase: any = await PatientCase.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!patientCase) return res.status(400).json({ message: "No case found." });

  patientCase = _.assign(
    patientCase,
    _.pick(req.body, ["patientId", "doctorId", "phone", "fee", "description"])
  );

  patientCase.caseDate = new Date(req.body.caseDate).toISOString();
  patientCase.updatedAt = new Date().toISOString();
  patientCase = await patientCase.save();
  patientCase = await caseView(patientCase);

  res.status(200).json({ message: "Case updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let patientCase = await PatientCase.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!patientCase) return res.status(400).json({ message: "No Data Found!" });

  await PatientCase.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Case deleted successfully." });
};

export const IpdOpdCaselist = async (req: Request, res: Response) => {
  const patientCase = await PatientCase.find({
    patientId: req.body.patientId,
    hospitalId: req.body.hid,
  })
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: patientCase });
};
