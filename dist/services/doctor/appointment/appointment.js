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
exports.UpcomingList = exports.updatePatient = exports.uploadFile = exports.view = exports.list = void 0;
const _validation_1 = require("./_validation");
const upload_1 = require("../../../helper/upload");
const lodash_1 = __importDefault(require("lodash"));
const patientsView = (patient) => __awaiter(void 0, void 0, void 0, function* () {
    patient = lodash_1.default.pick(patient, ["mFile"]);
    return patient;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Appointment.find({
            doctorId: req.body.did,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.appointment = yield _validation_1.Appointment.find({
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
    let appointmentRecord = result.appointment.length;
    result.lastPage = appointmentRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateView)(req.body);
    if (error)
        throw error;
    let appointment = yield _validation_1.Appointment.findOne({ _id: req.body.aid })
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
});
exports.view = view;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { error } = validateUpload(req.body);
    // if (error) throw error;
    req.body.fileType = "prescription";
    yield (0, upload_1.fileUpload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(400).json({ message: err.message });
        if (!req.body.filename)
            return res.status(400).json({ message: "Please select the file." });
        res.status(200).json({
            message: "File uploaded successfully.",
            data: {
                filename: req.body.filename,
            },
        });
    }));
});
exports.uploadFile = uploadFile;
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let patient = yield _validation_1.Patients.findOne({ _id: req.body.pid });
    if (!patient)
        return res.status(404).json({ message: "No record found." });
    if (!Array.isArray(patient.mFile)) {
        patient.mFile = [];
    }
    if (req.body.uploadFile) {
        if (!patient.mFile.includes(req.body.uploadFile)) {
            patient.mFile.push(req.body.uploadFile);
        }
        else {
            return res.status(400).json({ message: "File Exists with same name" });
        }
    }
    patient.updatedAt = new Date().toISOString();
    patient = yield patient.save();
    patient = yield patientsView(patient);
    res.status(200).json({ message: "Mfile uploaded in Patient Profile" });
});
exports.updatePatient = updatePatient;
const UpcomingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Appointment.find({
            doctorId: req.body.did,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.appointment = yield _validation_1.Appointment.find({
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
    let appointmentRecord = result.appointment.length;
    result.lastPage = appointmentRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.UpcomingList = UpcomingList;
