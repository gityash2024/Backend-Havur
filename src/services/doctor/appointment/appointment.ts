import { Request, Response } from "express";
import {
  Appointment,
  Patients,
  validateView,
  validateUpdate,
} from "./_validation";
import { fileUpload } from "../../../helper/upload";
import _ from "lodash";

const patientsView = async (patient: any) => {
  patient = _.pick(patient, ["mFile"]);
  return patient;
};
export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Appointment.find({
      doctorId: req.body.did,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.appointment = await Appointment.find({
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
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let appointmentRecord: number = result.appointment.length;
  result.lastPage = appointmentRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateView(req.body);
  if (error) throw error;
  let appointment: any = await Appointment.findOne({ _id: req.body.aid })
    .populate("patientId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailAddress: 1,
      gender: 1,
      birthDate: 1,
    })
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 });

  if (!appointment)
    return res.status(400).json({ message: "No record found." });

  res.status(200).json({ data: { appointment: appointment } });
};

export const uploadFile = async (req: Request, res: Response) => {
  // const { error } = validateUpload(req.body);
  // if (error) throw error;
  req.body.fileType = "prescription";
  await fileUpload(req, res, async (err: any) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.body.filename)
      return res.status(400).json({ message: "Please select the file." });
    res.status(200).json({
      message: "File uploaded successfully.",
      data: {
        filename: req.body.filename,
      },
    });
  });
};

export const updatePatient = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let patient: any = await Patients.findOne({ _id: req.body.pid });
  if (!patient) return res.status(404).json({ message: "No record found." });

  if (!Array.isArray(patient.mFile)) {
    patient.mFile = [];
  }
  if (req.body.uploadFile) {
    if (!patient.mFile.includes(req.body.uploadFile)) {
      patient.mFile.push(req.body.uploadFile);
    } else {
      return res.status(400).json({ message: "File Exists with same name" });
    }
  }

  patient.updatedAt = new Date().toISOString();
  patient = await patient.save();
  patient = await patientsView(patient);

  res.status(200).json({ message: "Mfile uploaded in Patient Profile" });
};

export const UpcomingList = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: number = (pageNo - 1) * recordPerPage;
  let limit: number = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Appointment.find({
      doctorId: req.body.did,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }

  result.appointment = await Appointment.find({
    doctorId: req.body.did,
    status: true,
    slotTime: { $gte: new Date() }, // Filter for upcoming appointments
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
    .sort({ createdAt: 1 }) // Sort by appointment date
    .skip(skip)
    .limit(limit)
    .lean();

  let appointmentRecord: number = result.appointment.length;
  result.lastPage = appointmentRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};
