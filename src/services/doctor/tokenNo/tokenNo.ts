import { Request, Response } from "express";
import { Appointment, TokenNo, validateAdd } from "./_validation";
import _ from "lodash";
// import { startOfDay } from "date-fns";

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let tokenNo: any = new TokenNo(_.pick(req.body, ["tokenNo", "hospitalId"]));
  tokenNo.doctorId = req.body.did;
  tokenNo.date = new Date(req.body.date).toISOString();
  tokenNo.createdAt = new Date().toISOString();
  tokenNo.updatedAt = new Date().toISOString();
  tokenNo = await tokenNo.save();

  res.status(200).json({ message: "Token no added successfully." });
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 100;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await TokenNo.find({
      doctorId: req.body.did,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.tokenNo = await TokenNo.find({
    doctorId: req.body.did,
    status: true,
  })
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let tokenNoRecord: number = result.tokenNo.length;
  result.lastPage = tokenNoRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

// export const countTokensToday = async (req: Request, res: Response) => {
//   // Get the start and end of the current day
//   const startDate = startOfDay(new Date());
//   // const endDate = endOfDay(new Date());

//   // Count the total tokens for the given doctor and hospital on the current day
//   const totalTokensToday = await Appointment.find({
//     doctorId: req.body.did,
//     createdAt: { $gte: startDate },
//     status: true,
//   }).countDocuments();

//   res.status(200).json({ data: totalTokensToday });
// };

export const countTokensToday = async (req: Request, res: Response) => {
  // Get the start and end of the current day in UTC
  const now = new Date();
  const startDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
  const endDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  // Count the total tokens for the given doctor and hospital on the current day
  const totalTokensToday = await Appointment.find({
    doctorId: req.body.did,
    createdAt: { $gte: startDate, $lte: endDate },
    status: true,
  }).countDocuments();

  res.status(200).json({ data: totalTokensToday });
};

export const currentToken = async (req: Request, res: Response) => {
  let latestToken: any = await TokenNo.findOne({
    doctorId: req.body.did, // Assuming hid is sent in the request body
    status: true,
  })
    .sort({ _id: -1 }) // Or another field that defines the latest record
    .lean();

  res.status(200).json({ data: latestToken.tokenNo });
};

export const HospitalCurrentToken = async (req: Request, res: Response) => {
  let latestToken = await TokenNo.findOne({
    doctorId: req.body.did,
    hospitalId: req.body.hospitalId, // Assuming hid is sent in the request body
    status: true,
  })
    .sort({ _id: -1 }) // Or another field that defines the latest record
    .lean();

  res.status(200).json({ data: latestToken });
};
