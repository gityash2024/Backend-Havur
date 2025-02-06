import { Request, Response } from "express";
import { Admission, Doctor, Patient, validateAdd } from "./_validation";
import _ from "lodash";
import generateAutoID from "../../../helper/autoGenerate";

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let is_patient: any = await Patient.findOne({
    _id: req.body.patientId,
  }).select({ password: 0, verificationCode: 0, status: 0 });
  if (!is_patient) return res.status(400).json({ message: "No Patient Found" });

  let is_doctor: any = await Doctor.findOne({ _id: req.body.doctorId }).select({
    password: 0,
    verificationCode: 0,
    status: 0,
  });
  if (!is_doctor) return res.status(400).json({ message: "No Doctor Found" });

  let admission: any = new Admission(
    _.pick(req.body, ["patientId", "doctorId"])
  );

  admission.admissionId = generateAutoID(8);
  admission.hospitalId = req.body.hid;
  admission.admissionDate = new Date(req.body.admissionDate).toISOString();
  if (req.body.dischargeDate) {
    admission.dischargeDate = new Date(req.body.dischargeDate).toISOString();
  }
  admission.createdAt = new Date().toISOString();
  admission.updatedAt = new Date().toISOString();
  admission = await admission.save();

  res.status(200).json({ data: { message: "Admission done successfully." } });
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Admission.find({
      hospitalId: req.body.hid,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.admission = await Admission.find({
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
      email: 1,
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let admissionRecord: number = result.admission.length;
  result.lastPage = admissionRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const patientViseAdmissionList = async (req: Request, res: Response) => {
  let admission = await Admission.find({
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
      email: 1,
    })
    .sort({ _id: -1 })
    .lean();
  res.status(200).json({ data: admission });
};

export const view = async (req: Request, res: Response) => {
  let admission = await Admission.findOne({
    hospitalId: req.body.hid,
    _id: req.body.id,
  })
    .populate("patientId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailAddress: 1,
      gender: 1,
      birthDate: 1,
      mediclaim: 1,
    })
    .populate("doctorId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      email: 1,
    })
    .sort({ _id: -1 })
    .lean();
  res.status(200).json({ data: admission });
};
