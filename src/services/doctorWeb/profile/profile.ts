import { Request, Response } from "express";
import { Doctor, validateUpdate } from "./_validation";
import { fileDelete, fileUpload } from "../../../helper/upload";
import _ from "lodash";

const doctorView = async (doctor: any) => {
  doctor = _.pick(doctor, [
    "reference",
    "type",
    "firstName",
    "lastName",
    "middleName",
    "qualification",
    "specialization",
    "department",
    "registrationNo",
    "image",
    "dob",
    "wedding",
    "pancard",
    "aadharNo",
    "mobileNumber",
    "phone",
    "email",
    "cName",
    "address",
    "area",
    "city",
    "pin",
    "state",
    "country",
    "cPhone",
    "appointmentCharge",
    "mFile",
    "age",
  ]);
  return doctor;
};

export const view = async (req: Request, res: Response) => {
  let doctor: any = await Doctor.findOne({ _id: req.body.did }).select({
    password: 0,
    verificationCode: 0,
    status: 0,
  });
  if (!doctor) return res.status(400).json({ message: "No record found." });

  res.status(200).json({ data: { doctor: doctor } });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let doctors: any = await Doctor.findOne({ _id: req.body.did });
  if (!doctors) return res.status(404).json({ message: "No record found." });
  if (req.body.email) {
    let isEmailExist: any = await Doctor.findOne({
      email: req.body.email,
    });
    if (isEmailExist)
      return res.status(400).json({ message: "Email address already in use." });
  }

  doctors = _.assign(
    doctors,
    _.pick(req.body, [
      "reference",
      "type",
      "firstName",
      "lastName",
      "middleName",
      "qualification",
      "specialization",
      "department",
      "registrationNo",
      "image",
      "dob",
      "wedding",
      "pancard",
      "aadharNo",
      "phone",
      "appointmentCharge",
      "age",
    ])
  );
  doctors.clinicDetails.cName = req.body.cName;
  doctors.clinicDetails.address = req.body.address;
  doctors.clinicDetails.area = req.body.area;
  doctors.clinicDetails.city = req.body.city;
  doctors.clinicDetails.pin = req.body.pin;
  doctors.clinicDetails.state = req.body.state;
  doctors.clinicDetails.country = req.body.country;
  doctors.clinicDetails.cPhone = req.body.cPhone;
  if (!Array.isArray(doctors.mFile)) {
    doctors.mFile = [];
  }
  if (req.body.uploadFile) {
    if (!doctors.mFile.includes(req.body.uploadFile)) {
      doctors.mFile.push(req.body.uploadFile);
    } else {
      return res.status(400).json({ message: "File Exists with same name" });
    }
  }

  if (req.body.deleteFile) {
    if (doctors.mFile.includes(req.body.deleteFile)) {
      doctors.mFile = doctors.mFile.filter(
        (file: string) => file !== req.body.deleteFile
      );
    } else {
      return res.status(400).json({ message: "File Does Not Exists" });
    }
  }
  doctors.updatedAt = new Date().toISOString();
  doctors = await doctors.save();
  doctors = await doctorView(doctors);

  res.status(200).json({ message: "Profile updated successfully." });
};

export const uploadFile = async (req: Request, res: Response) => {
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

export const deleteFile = async (req: Request, res: Response) => {
  if (!req.body.filename || req.body.filename === "")
    return res.status(400).json({ message: "File is not selected." });

  const isDelete: any = await fileDelete(req.body.filename);
  if (!isDelete) {
    return res.status(404).json({ message: "No File Found" });
  }

  res.status(200).json({ message: "File deleted successfully." });
};

export const viewMfile = async (req: Request, res: Response) => {
  const { did, fileType } = req.body;
  let doctor: any = await Doctor.findOne({ _id: did }).select({ mFile: 1 });
  if (!doctor) return res.status(400).json({ message: "No record found." });
  let filterFiles = doctor.mFile;
  if (fileType) {
    const regex = new RegExp(`/${fileType}/`, "i");
    filterFiles = doctor.mFile.filter((file: string) => regex.test(file));
  }
  res.status(200).json({ data: { doctor: { mFile: filterFiles } } });
};

export const updateSelectedHospital = async (req: Request, res: Response) => {
  let doctors: any = await Doctor.findOne({ _id: req.body.did });
  if (!doctors) return res.status(404).json({ message: "No record found." });

  doctors = _.assign(doctors, _.pick(req.body, ["selectedHospital"]));

  doctors.updatedAt = new Date().toISOString();
  doctors = await doctors.save();

  res.status(200).json({ message: "Hospital set successfully." });
};
