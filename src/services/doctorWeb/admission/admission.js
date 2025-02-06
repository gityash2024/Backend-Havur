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
exports.list = exports.add = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let is_patient = yield _validation_1.Patient.findOne({
        _id: req.body.patientId,
    }).select({ password: 0, verificationCode: 0, status: 0 });
    if (!is_patient)
        return res.status(400).json({ message: "No Patient Found" });
    let is_doctor = yield _validation_1.Doctor.findOne({ _id: req.body.did }).select({
        password: 0,
        verificationCode: 0,
        status: 0,
    });
    if (!is_doctor)
        return res.status(400).json({ message: "No Doctor Found" });
    let admission = new _validation_1.Admission(lodash_1.default.pick(req.body, ["patientId", "hospitalId"]));
    admission.doctorId = req.body.did;
    admission.admissionDate = new Date(req.body.admissionDate).toISOString();
    if (req.body.dischargeDate) {
        admission.dischargeDate = new Date(req.body.dischargeDate).toISOString();
    }
    admission.createdAt = new Date().toISOString();
    admission.updatedAt = new Date().toISOString();
    admission = yield admission.save();
    res.status(200).json({ data: { message: "Admission done successfully." } });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Admission.find({
            doctorId: req.body.did,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.admission = yield _validation_1.Admission.find({
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
    let admissionRecord = result.admission.length;
    result.lastPage = admissionRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
