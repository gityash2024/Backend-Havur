import { Request, Response } from "express";
import { Appointment, validateAdd, validateView } from "./_validation";
import _ from "lodash";

async function getLastTokenNo(doctorId: string): Promise<number> {
  // Get the current date and set it to the start of the day (UTC)
  const now = new Date();
  const startOfDay = new Date(
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

  // Create a new date object for the end of the day (UTC)
  const endOfDay = new Date(
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

  // Find the last token number for the doctor on the current date where slotTime is null
  const result = await Appointment.find({
    doctorId: doctorId,
    slotTime: null,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    appointmentBy: "hospital",
  })
    .sort({ tokenNo: -1 })
    .limit(1);

  console.log(result);

  // Return the token number or 0 if no appointments are found
  if (result.length > 0) {
    return result[0].tokenNo;
  } else {
    return 0;
  }
}

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let appointment: any = new Appointment(
    _.pick(req.body, ["patientId", "doctorId", "appointmentType"])
  );
  appointment.appointmentBy = "hospital";
  appointment.hospitalId = req.body.hid;
  if (!req.body.slotTime) {
    let lastTokenNo = await getLastTokenNo(appointment.doctorId);

    // Ensure the new token number is odd
    if (lastTokenNo % 2 === 0) {
      appointment.tokenNo = lastTokenNo + 1;
    } else {
      appointment.tokenNo = lastTokenNo + 2;
    }
    appointment.createdAt = new Date().toISOString();
    appointment.updatedAt = new Date().toISOString();
    appointment = await appointment.save();

    res.status(200).json({
      data: {
        appointmentTokenNo: appointment.tokenNo,
        message: "Appointment added successfully.",
      },
    });
  } else if (req.body.slotTime) {
    const requestedDate = new Date(req.body.slotTime);
    const currentDate = new Date();
    if (requestedDate < currentDate) {
      return res
        .status(400)
        .json({ error: "Please Select Correct Date & Time" });
    } else {
      appointment.slotTime = requestedDate.toISOString();
    }

    appointment.createdAt = new Date().toISOString();
    appointment.updatedAt = new Date().toISOString();
    appointment = await appointment.save();

    res.status(200).json({ message: "Appointment added successfully." });
  }
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateView(req.body);
  if (error) throw error;

  let appointment: any = await Appointment.findOne({
    _id: req.body.aid,
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
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
    .populate("doctorId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailId: 1,
    });
  if (!appointment)
    return res.status(400).json({ message: "No record found." });

  res.status(200).json({ data: { appointment: appointment } });
};

export const list = async (req: Request, res: Response) => {
  let result: any = {};

  let totalRecords: number = await Appointment.find({
    hospitalId: req.body.hid,
    status: true,
  }).countDocuments();
  result.totalRecords = totalRecords;

  result.appointment = await Appointment.find({
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
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
    .populate("doctorId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      email: 1,
    })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: result });
};

export const upcoming = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;
  const currentDateTime = new Date().toISOString();

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Appointment.find({
      hospitalId: req.body.hid,
      status: true,
      slotTime: { $gt: currentDateTime },
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.appointment = await Appointment.find({
    hospitalId: req.body.hid,
    status: true,
    slotTime: { $gt: currentDateTime },
  })
    .populate("patientId", {
      name: 1,
      mobileNumber: 1,
      emailAddress: 1,
      gender: 1,
      birthDate: 1,
    })
    .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
    .populate("doctorId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailId: 1,
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let appointmentRecord: number = result.appointment.length;
  result.lastPage = appointmentRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};
