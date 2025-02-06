import { Request, Response } from "express";
import { AppointmentTransaction } from "./_validation";
import mongoose from "mongoose";

export const list = async (req: Request, res: Response) => {
  let appointmentTransaction = await AppointmentTransaction.aggregate([
    {
      $match: {
        hospitalId: new mongoose.Types.ObjectId(req.body.hospitalId), // Match by hospitalId
      },
    },
    {
      $lookup: {
        from: "appointment", // Collection to join (appointments)
        localField: "appointmentId",
        foreignField: "_id",
        as: "appointmentDetails",
      },
    },
    {
      $unwind: "$appointmentDetails", // Unwind the appointment details
    },
    {
      $lookup: {
        from: "patients", // Join with patients
        localField: "appointmentDetails.patientId",
        foreignField: "_id",
        as: "patientDetails",
      },
    },
    {
      $unwind: "$patientDetails", // Unwind the patient details
    },
    {
      $lookup: {
        from: "doctors", // Join with doctors
        localField: "appointmentDetails.doctorId",
        foreignField: "_id",
        as: "doctorDetails",
      },
    },
    {
      $unwind: "$doctorDetails", // Unwind the doctor details
    },
    {
      $project: {
        _id: 1,
        appointmentId: 1,
        transactionType: 1,
        transactionId: 1,
        status: 1,
        hospitalId: 1,
        createdAt: 1,
        updatedAt: 1,
        "appointmentDetails._id": 1,
        "appointmentDetails.appointmentCharge": 1,
        "appointmentDetails.paymentMode": 1,
        "appointmentDetails.createdAt": 1,
        "patientDetails._id": 1,
        "patientDetails.firstName": 1,
        "patientDetails.lastName": 1,
        "patientDetails.emailAddress": 1,
        "patientDetails.photo": 1,
        "doctorDetails._id": 1,
        "doctorDetails.firstName": 1,
        "doctorDetails.lastName": 1,
        "doctorDetails.email": 1,
        "doctorDetails.image": 1,
      },
    },
  ]);

  res.status(200).json({ data: appointmentTransaction });
};
