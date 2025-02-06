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
exports.upcoming = exports.list = exports.view = exports.add = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
function getLastTokenNo(doctorId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the current date and set it to the start of the day (UTC)
        const now = new Date();
        const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
        // Create a new date object for the end of the day (UTC)
        const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
        // Find the last token number for the doctor on the current date where slotTime is null
        const result = yield _validation_1.Appointment.find({
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
        }
        else {
            return 0;
        }
    });
}
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let appointment = new _validation_1.Appointment(lodash_1.default.pick(req.body, ["patientId", "doctorId", "appointmentType"]));
    appointment.appointmentBy = "hospital";
    appointment.hospitalId = req.body.hid;
    if (!req.body.slotTime) {
        let lastTokenNo = yield getLastTokenNo(appointment.doctorId);
        // Ensure the new token number is odd
        if (lastTokenNo % 2 === 0) {
            appointment.tokenNo = lastTokenNo + 1;
        }
        else {
            appointment.tokenNo = lastTokenNo + 2;
        }
        appointment.createdAt = new Date().toISOString();
        appointment.updatedAt = new Date().toISOString();
        appointment = yield appointment.save();
        res.status(200).json({
            data: {
                appointmentTokenNo: appointment.tokenNo,
                message: "Appointment added successfully.",
            },
        });
    }
    else if (req.body.slotTime) {
        const requestedDate = new Date(req.body.slotTime);
        const currentDate = new Date();
        if (requestedDate < currentDate) {
            return res
                .status(400)
                .json({ error: "Please Select Correct Date & Time" });
        }
        else {
            appointment.slotTime = requestedDate.toISOString();
        }
        appointment.createdAt = new Date().toISOString();
        appointment.updatedAt = new Date().toISOString();
        appointment = yield appointment.save();
        res.status(200).json({ message: "Appointment added successfully." });
    }
});
exports.add = add;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateView)(req.body);
    if (error)
        throw error;
    let appointment = yield _validation_1.Appointment.findOne({
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
});
exports.view = view;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = {};
    let totalRecords = yield _validation_1.Appointment.find({
        hospitalId: req.body.hid,
        status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
    result.appointment = yield _validation_1.Appointment.find({
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
});
exports.list = list;
const upcoming = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    const currentDateTime = new Date().toISOString();
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Appointment.find({
            hospitalId: req.body.hid,
            status: true,
            slotTime: { $gt: currentDateTime },
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.appointment = yield _validation_1.Appointment.find({
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
    let appointmentRecord = result.appointment.length;
    result.lastPage = appointmentRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.upcoming = upcoming;
