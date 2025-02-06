import { Request, Response } from "express";
import {
  Appointment,
  AppointmentTransaction,
  Doctor,
  validateAdd,
  validateView,
} from "./_validation";
import _ from "lodash";
// import moment from "moment";

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
    appointmentBy: "patient",
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

  let doctor: any = await Doctor.findOne({
    _id: req.body.doctorId,
  });
  let appointment: any = new Appointment(
    _.pick(req.body, [
      "hospitalId",
      "doctorId",
      "appointmentType",
      "files",
      "appointmentCharge",
    ])
  );
  appointment.appointmentBy = "patient";
  appointment.patientId = req.body.pid;
  if (!req.body.slotTime) {
    // const date: any = moment().startOf("day").toDate();
    appointment.tokenNo = (await getLastTokenNo(appointment.doctorId)) + 2;
    appointment.appointmentCharge = doctor?.appointmentCharge;
    appointment.paymentMode = "Online";
    appointment.createdAt = new Date().toISOString();
    appointment.updatedAt = new Date().toISOString();
    appointment = await appointment.save();

    let appointmentTransacton = await AppointmentTransaction.find({
      appointmentId: appointment._id,
    });
    if (!appointmentTransacton) {
      let appointmentCharge: any = new AppointmentTransaction({
        appointmentId: appointment._id,
        transactionType: "Online",
        transactionId: "",
        status: true,
      });

      appointmentCharge = appointmentCharge.save();
    }

    res.status(200).json({
      data: {
        id: appointment._id,
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

    appointment.appointmentCharge = doctor?.appointmentCharge;
    appointment.paymentMode = "Online";
    appointment.createdAt = new Date().toISOString();
    appointment.updatedAt = new Date().toISOString();
    appointment = await appointment.save();

    let appointmentTransacton = await AppointmentTransaction.find({
      appointmentId: appointment._id,
    });
    if (!appointmentTransacton) {
      let appointmentCharge: any = new AppointmentTransaction({
        appointmentId: appointment._id,
        transactionType: "Online",
        transactionId: "",
        status: true,
      });

      appointmentCharge = appointmentCharge.save();
    }

    res.status(200).json({
      id: appointment._id,
      message: "Appointment added successfully.",
    });
  }
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateView(req.body);
  if (error) throw error;

  let appointment: any = await Appointment.findOne({
    _id: req.body.aid,
    patientId: req.body.pid,
    status: true,
  })
    .populate("patientId", {
      name: 1,
      mobileNumber: 1,
      emailAddress: 1,
      gender: 1,
      birthDate: 1,
    })
    .populate("hospitalId", {
      name: 1,
      mobileNumber: 1,
      emailAddress: 1,
      description: 1,
      address: 1,
    })
    .populate("doctorId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      email: 1,
      appointmentCharge: 1,
    });
  if (!appointment)
    return res.status(400).json({ message: "No record found." });

  res.status(200).json({ data: { appointment: appointment } });
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Appointment.find({
      patientId: req.body.pid,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.appointment = await Appointment.find({
    patientId: req.body.pid,
    status: true,
  })
    .populate("patientId", {
      name: 1,
      mobileNumber: 1,
      emailAddress: 1,
      gender: 1,
      birthDate: 1,
    })
    .populate("hospitalId", {
      name: 1,
      mobileNumber: 1,
      emailAddress: 1,
      description: 1,
      address: 1,
    })
    .populate("doctorId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      email: 1,
      appointmentCharge: 1,
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let appointmentRecord: number = result.appointment.length;
  result.lastPage = appointmentRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const cancel = async (req: Request, res: Response) => {
  let appointment: any = await Appointment.findOne({ _id: req.body.id });
  if (!appointment)
    return res.status(404).json({ message: "No record found." });

  appointment.status = false;
  appointment.updatedAt = new Date().toISOString();
  appointment = await appointment.save();

  res.status(200).json({ message: "Appointment Cancel successfully." });
};

export const reschedule = async (req: Request, res: Response) => {
  let appointment: any = await Appointment.findOne({ _id: req.body.id });
  if (!appointment)
    return res.status(404).json({ message: "No record found." });

  const requestedDate = new Date(req.body.slotTime);
  const currentDate = new Date();
  if (requestedDate < currentDate) {
    return res.status(400).json({ error: "Please Select Correct Date & Time" });
  } else {
    appointment.slotTime = requestedDate.toISOString();
  }
  appointment.updatedAt = new Date().toISOString();
  appointment = await appointment.save();

  res.status(200).json({ message: "Appointment Reschedule successfully." });
};
