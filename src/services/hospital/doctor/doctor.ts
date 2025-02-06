import { Request, Response } from "express";
import { Doctors, validateAdd, validateAcceptdoctor } from "./_validation";
import _ from "lodash";
import { encrypt } from "../../../helper/encription";

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;
  if (req.body.password != req.body.confirmPassword)
    return res
      .status(400)
      .json({ message: "Password and Confirm Password should be same" });

  const emailExist = await Doctors.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({ message: "Email already exists." });

  const mobileExist = await Doctors.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (mobileExist)
    return res.status(400).json({ message: "Mobile Number already exists." });

  let doctor: any = new Doctors(
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
      "mobileNumber",
      "phone",
      "email",
      "age",
    ])
  );

  doctor.password = await encrypt(req.body.password);
  doctor.shareIn.opd = req.body.opd;
  doctor.shareIn.indoorVisite = req.body.indoorVisite;
  doctor.shareIn.operation = req.body.operation;
  doctor.shareIn.procedure = req.body.procedure;
  doctor.clinicDetails.cName = req.body.cName;
  doctor.clinicDetails.address = req.body.address;
  doctor.clinicDetails.area = req.body.area;
  doctor.clinicDetails.city = req.body.city;
  doctor.clinicDetails.pin = req.body.pin;
  doctor.clinicDetails.state = req.body.state;
  doctor.clinicDetails.country = req.body.country;
  doctor.clinicDetails.cPhone = req.body.cPhone;
  doctor.createdAt = new Date().toISOString();
  doctor.updatedAt = new Date().toISOString();
  doctor.hospitalId = [{ _id: req.body.hid, hospitalStatus: "success" }];
  doctor = await doctor.save();

  res.status(200).json({ message: "doctor added successfully." });
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.firstName) {
    filter["firstName"] = req.body.firstName;
  }
  if (req.body.lastName) {
    filter["lastName"] = req.body.lastName;
  }
  if (req.body.department) {
    filter["department"] = req.body.department;
  }
  if (req.body.designation) {
    filter["designation"] = req.body.designation;
  }
  if (req.body.emailId) {
    filter["emailId"] = req.body.emailId;
  }
  if (req.body.mobileNumber) {
    filter["mobileNumber"] = req.body.mobileNumber;
  }
  if (req.body.gender) {
    filter["gender"] = req.body.gender;
  }
  if (req.body.city) {
    filter["city"] = req.body.city;
  }
  if (req.body.status) {
    filter["hospitalId.hospitalStatus"] = req.body.status;
  }

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Doctors.find({
      "hospitalId._id": req.body.hid,
      $and: [filter],
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.doctor = await Doctors.find({
    "hospitalId._id": req.body.hid,
    $and: [filter],
  })
    .select({
      password: 0,
      otp: 0,
      status: 0,
      requestType: 0,
      requestStatus: 0,
      hospitalId: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let doctorRecord: number = result.doctor.length;
  result.lastPage = doctorRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const acceptDoctor = async (req: Request, res: Response) => {
  const { error } = validateAcceptdoctor(req.body);
  if (error) throw error;
  let doctor: any = await Doctors.findOne({
    "hospitalId._id": req.body.hid,
    _id: req.body.did,
    "hospitalId.hospitalStatus": "pending",
  });
  if (!doctor) return res.status(404).json({ message: "No record found." });
  for (let i = 0; i < doctor.hospitalId.length; i++) {
    if (doctor.hospitalId[i]._id.toString() === req.body.hid) {
      doctor.hospitalId[i].hospitalStatus = "success";
      break;
    }
  }
  doctor.updatedAt = new Date().toISOString();
  doctor = await doctor.save();
  res.status(200).json({ message: "Doctor Request Accepeted Successfully..." });
};
