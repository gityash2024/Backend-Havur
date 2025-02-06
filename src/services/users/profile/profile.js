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
exports.viewMfile = exports.deleteFile = exports.uploadFile = exports.update = exports.view = void 0;
const _validation_1 = require("./_validation");
const upload_1 = require("../../../helper/upload");
const lodash_1 = __importDefault(require("lodash"));
const patientsView = (patient) => __awaiter(void 0, void 0, void 0, function* () {
    patient = lodash_1.default.pick(patient, [
        "firstName",
        "middleName",
        "lastName",
        "birthDate",
        "age",
        "gender",
        "wedding",
        "referenceBy",
        "language",
        "religion",
        "weight",
        "height",
        "maritialStatus",
        "residence",
        "office",
        "other",
        "address",
        "area",
        "state",
        "city",
        "pin",
        "emailAddress",
        "estimate",
        "aadharNo",
        "panNo",
        "memberShipId",
        "employeeId",
        "occupation",
        "spouseOccupation",
        "companyName",
        "education",
        "mediclaim",
        "mobileNumber",
        "photo",
        "mfile",
        "remark",
    ]);
    return patient;
});
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let patient = yield _validation_1.Patients.findOne({ _id: req.body.pid }).select({
        password: 0,
        verificationCode: 0,
        status: 0,
    });
    if (!patient)
        return res.status(400).json({ message: "No record found." });
    res.status(200).json({ data: { patient: patient } });
});
exports.view = view;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let patient = yield _validation_1.Patients.findOne({ _id: req.body.pid });
    if (!patient)
        return res.status(404).json({ message: "No record found." });
    let isEmailExist = yield _validation_1.Patients.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (isEmailExist)
        return res.status(400).json({ message: "Email address already in use." });
    patient = lodash_1.default.assign(patient, lodash_1.default.pick(req.body, [
        "firstName",
        "middleName",
        "lastName",
        "birthDate",
        "age",
        "gender",
        "wedding",
        "referenceBy",
        "language",
        "religion",
        "weight",
        "height",
        "maritialStatus",
        "estimate",
        "aadharNo",
        "panNo",
        "membershipId",
        "employeeId",
        "occupation",
        "spouseOccupation",
        "companyName",
        "education",
        "mediclaim",
        "photo",
        "remark",
    ]));
    patient.address.address = req.body.address;
    patient.address.area = req.body.area;
    patient.address.state = req.body.state;
    patient.address.city = req.body.city;
    patient.address.pin = req.body.pin;
    patient.communication.residence = req.body.residence;
    patient.communication.office = req.body.office;
    patient.communication.other = req.body.other;
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
    if (req.body.deleteFile) {
        if (patient.mFile.includes(req.body.deleteFile)) {
            patient.mFile = patient.mFile.filter((file) => file !== req.body.deleteFile);
        }
        else {
            return res.status(400).json({ message: "File Does Not Exists" });
        }
    }
    patient.updatedAt = new Date().toISOString();
    patient = yield patient.save();
    patient = yield patientsView(patient);
    res.status(200).json({ message: "Profile updated successfully." });
});
exports.update = update;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.filename || req.body.filename === "")
        return res.status(400).json({ message: "File is not selected." });
    const isDelete = yield (0, upload_1.fileDelete)(req.body.filename);
    if (!isDelete) {
        return res.status(404).json({ message: "No File Found" });
    }
    res.status(200).json({ message: "File deleted successfully." });
});
exports.deleteFile = deleteFile;
const viewMfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, fileType } = req.body;
    let patient = yield _validation_1.Patients.findOne({ _id: pid }).select({ mFile: 1 });
    if (!patient)
        return res.status(400).json({ message: "No record found." });
    let filterFiles = patient.mFile;
    if (fileType) {
        const regex = new RegExp(`/${fileType}/`, "i");
        filterFiles = patient.mFile.filter((file) => regex.test(file));
    }
    res.status(200).json({ data: { patient: { mFile: filterFiles } } });
});
exports.viewMfile = viewMfile;
