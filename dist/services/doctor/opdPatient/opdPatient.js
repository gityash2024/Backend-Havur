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
exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const autoGenerate_1 = __importDefault(require("./../../../helper/autoGenerate"));
const opdPatientView = (opdPatient) => __awaiter(void 0, void 0, void 0, function* () {
    opdPatient = lodash_1.default.pick(opdPatient, [
        "patientId",
        "caseId",
        "hospitalId",
        "opdNo",
        "weight",
        "height",
        "bloodPressure",
        "appointmentDate",
        "doctorOpdCharge",
        "paymentMode",
        "symptoms",
        "notes",
        "history",
        "status",
    ]);
    return opdPatient;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.OpdPatient.find({
            doctorId: req.body.did,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.opdPatient = yield _validation_1.OpdPatient.find({
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
        .populate("caseId", {
        caseId: 1,
        caseDate: 1,
        phone: 1,
        fee: 1,
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let opdPatientRecord = result.opdPatient.length;
    result.lastPage = opdPatientRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let patientExist = yield _validation_1.OpdPatient.findOne({
        patientId: req.body.patientId,
        doctorId: req.body.did,
    });
    if (patientExist)
        return res.status(400).json({ message: "Patient already exist." });
    let opdPatient = new _validation_1.OpdPatient(lodash_1.default.pick(req.body, [
        "patientId",
        "caseId",
        "hospitalId",
        "weight",
        "height",
        "bloodPressure",
        "appointmentDate",
        "doctorOpdCharge",
        "paymentMode",
        "symptoms",
        "notes",
        "history",
        "status",
    ]));
    opdPatient.opdNo = (0, autoGenerate_1.default)(8);
    opdPatient.doctorId = req.body.did;
    opdPatient.createdAt = new Date().toISOString();
    opdPatient.updatedAt = new Date().toISOString();
    opdPatient = yield opdPatient.save();
    res.status(200).json({ message: "OPD patient added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let opdPatient = yield _validation_1.OpdPatient.findOne({
        _id: req.body.id,
        doctorId: req.body.did,
    });
    if (!opdPatient)
        return res.status(400).json({ message: "No patient found." });
    if (opdPatient.patientId === req.body.patientId)
        return res.status(400).json({ message: "OPD patient already exist." });
    opdPatient = lodash_1.default.assign(opdPatient, lodash_1.default.pick(req.body, [
        "patientId",
        "caseId",
        "hospitalId",
        "weight",
        "height",
        "bloodPressure",
        "appointmentDate",
        "doctorOpdCharge",
        "paymentMode",
        "symptoms",
        "notes",
        "history",
        "status",
    ]));
    opdPatient.updatedAt = new Date().toISOString();
    opdPatient = yield opdPatient.save();
    opdPatient = yield opdPatientView(opdPatient);
    res.status(200).json({ message: "OPD patient updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let opdPatient = yield _validation_1.OpdPatient.findOne({
        _id: req.body.id,
        doctorId: req.body.did,
    });
    if (!opdPatient)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.OpdPatient.deleteOne({ _id: req.body.id, doctorId: req.body.did });
    res.status(200).json({ message: "OPD patient deleted successfully." });
});
exports.remove = remove;
