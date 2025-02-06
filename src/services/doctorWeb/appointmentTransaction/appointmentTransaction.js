"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let appointmentTransaction = yield _validation_1.AppointmentTransaction.aggregate([
        {
            $match: {
                hospitalId: new mongoose_1.default.Types.ObjectId(req.body.hospitalId), // Match by hospitalId
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
});
exports.list = list;
