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
exports.updateSelectedHospital = exports.viewMfile = exports.deleteFile = exports.uploadFile = exports.update = exports.view = void 0;
const _validation_1 = require("./_validation");
const upload_1 = require("../../../helper/upload");
const lodash_1 = __importDefault(require("lodash"));
const doctorView = (doctor) => __awaiter(void 0, void 0, void 0, function* () {
    doctor = lodash_1.default.pick(doctor, [
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
        "cName",
        "address",
        "area",
        "city",
        "pin",
        "state",
        "country",
        "cPhone",
        "appointmentCharge",
        "mFile",
        "age",
    ]);
    return doctor;
});
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let doctor = yield _validation_1.Doctor.findOne({ _id: req.body.did }).select({
        password: 0,
        verificationCode: 0,
        status: 0,
    });
    if (!doctor)
        return res.status(400).json({ message: "No record found." });
    res.status(200).json({ data: { doctor: doctor } });
});
exports.view = view;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let doctors = yield _validation_1.Doctor.findOne({ _id: req.body.did });
    if (!doctors)
        return res.status(404).json({ message: "No record found." });
    if (req.body.email) {
        let isEmailExist = yield _validation_1.Doctor.findOne({
            email: req.body.email,
        });
        if (isEmailExist)
            return res.status(400).json({ message: "Email address already in use." });
    }
    doctors = lodash_1.default.assign(doctors, lodash_1.default.pick(req.body, [
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
        "phone",
        "appointmentCharge",
        "age",
    ]));
    doctors.clinicDetails.cName = req.body.cName;
    doctors.clinicDetails.address = req.body.address;
    doctors.clinicDetails.area = req.body.area;
    doctors.clinicDetails.city = req.body.city;
    doctors.clinicDetails.pin = req.body.pin;
    doctors.clinicDetails.state = req.body.state;
    doctors.clinicDetails.country = req.body.country;
    doctors.clinicDetails.cPhone = req.body.cPhone;
    if (!Array.isArray(doctors.mFile)) {
        doctors.mFile = [];
    }
    if (req.body.uploadFile) {
        if (!doctors.mFile.includes(req.body.uploadFile)) {
            doctors.mFile.push(req.body.uploadFile);
        }
        else {
            return res.status(400).json({ message: "File Exists with same name" });
        }
    }
    if (req.body.deleteFile) {
        if (doctors.mFile.includes(req.body.deleteFile)) {
            doctors.mFile = doctors.mFile.filter((file) => file !== req.body.deleteFile);
        }
        else {
            return res.status(400).json({ message: "File Does Not Exists" });
        }
    }
    doctors.updatedAt = new Date().toISOString();
    doctors = yield doctors.save();
    doctors = yield doctorView(doctors);
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
    const { did, fileType } = req.body;
    let doctor = yield _validation_1.Doctor.findOne({ _id: did }).select({ mFile: 1 });
    if (!doctor)
        return res.status(400).json({ message: "No record found." });
    let filterFiles = doctor.mFile;
    if (fileType) {
        const regex = new RegExp(`/${fileType}/`, "i");
        filterFiles = doctor.mFile.filter((file) => regex.test(file));
    }
    res.status(200).json({ data: { doctor: { mFile: filterFiles } } });
});
exports.viewMfile = viewMfile;
const updateSelectedHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let doctors = yield _validation_1.Doctor.findOne({ _id: req.body.did });
    if (!doctors)
        return res.status(404).json({ message: "No record found." });
    doctors = lodash_1.default.assign(doctors, lodash_1.default.pick(req.body, ["selectedHospital"]));
    doctors.updatedAt = new Date().toISOString();
    doctors = yield doctors.save();
    res.status(200).json({ message: "Hospital set successfully." });
});
exports.updateSelectedHospital = updateSelectedHospital;
