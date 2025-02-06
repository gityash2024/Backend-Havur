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
exports.associatedIpdList = exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const autoGenerate_1 = __importDefault(require("./../../../helper/autoGenerate"));
const ipdPatientView = (ipdPatient) => __awaiter(void 0, void 0, void 0, function* () {
    ipdPatient = lodash_1.default.pick(ipdPatient, [
        "patientId",
        "caseId",
        "doctorId",
        "weight",
        "height",
        "bloodPressure",
        "admissionDate",
        "bed",
        "bedType",
        "symptoms",
        "billStatus",
        "notes",
    ]);
    return ipdPatient;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.IpdPatient.find({
            hospitalId: req.body.hid,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.ipdPatient = yield _validation_1.IpdPatient.find({
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
        .populate("doctorId", {
        firstName: 1,
        lastName: 1,
        mobileNumber: 1,
        emailId: 1,
    })
        .populate("caseId", {
        caseId: 1,
        caseDate: 1,
        phone: 1,
        fee: 1,
    })
        .populate("bed", {
        bedId: 1,
        name: 1,
        available: 1,
    })
        .populate("bedType", {
        bedType: 1,
        description: 1,
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let ipdPatientRecord = result.ipdPatient.length;
    result.lastPage = ipdPatientRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let patientExist = yield _validation_1.IpdPatient.findOne({
        patientId: req.body.patientId,
        hospitalId: req.body.hid,
    });
    if (patientExist)
        return res.status(400).json({ message: "Patient already exist." });
    let opdPatient = new _validation_1.IpdPatient(lodash_1.default.pick(req.body, [
        "patientId",
        "caseId",
        "doctorId",
        "weight",
        "height",
        "bloodPressure",
        "bed",
        "bedType",
        "symptoms",
        "billStatus",
        "notes",
    ]));
    opdPatient.ipdNo = (0, autoGenerate_1.default)(8);
    opdPatient.hospitalId = req.body.hid;
    opdPatient.admissionDate = new Date(req.body.admissionDate);
    opdPatient.createdAt = new Date().toISOString();
    opdPatient.updatedAt = new Date().toISOString();
    opdPatient = yield opdPatient.save();
    res.status(200).json({ message: "IPD patient added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let ipdPatient = yield _validation_1.IpdPatient.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!ipdPatient)
        return res.status(400).json({ message: "No patient found." });
    if (ipdPatient.patientId === req.body.patientId)
        return res.status(400).json({ message: "IPD patient already exist." });
    ipdPatient = lodash_1.default.assign(ipdPatient, lodash_1.default.pick(req.body, [
        "patientId",
        "caseId",
        "doctorId",
        "weight",
        "height",
        "bloodPressure",
        "bed",
        "bedType",
        "symptoms",
        "billStatus",
        "notes",
    ]));
    ipdPatient.admissionDate = new Date(req.body.admissionDate).toISOString();
    ipdPatient.updatedAt = new Date().toISOString();
    ipdPatient = yield ipdPatient.save();
    ipdPatient = yield ipdPatientView(ipdPatient);
    res.status(200).json({ message: "IPD patient updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let ipdPatient = yield _validation_1.IpdPatient.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!ipdPatient)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.IpdPatient.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "IPD patient deleted successfully." });
});
exports.remove = remove;
const associatedIpdList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ipdPatient = yield _validation_1.IpdPatient.find({
        caseId: req.body.caseId,
        hospitalId: req.body.hid,
    })
        .populate("patientId", {
        firstName: 1,
        lastName: 1,
        mobileNumber: 1,
        emailAddress: 1,
        gender: 1,
        birthDate: 1,
    })
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: ipdPatient });
});
exports.associatedIpdList = associatedIpdList;
