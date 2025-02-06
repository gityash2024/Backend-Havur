import { Request, Response } from "express";
import { Doctors } from "./_validation";
import _ from "lodash";

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
    let totalRecords: number = await Doctors.find().countDocuments();
    result.totalRecords = totalRecords;
  }
  result.doctor = await Doctors.find({
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
