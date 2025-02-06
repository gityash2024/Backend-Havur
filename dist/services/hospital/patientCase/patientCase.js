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
exports.IpdOpdCaselist = exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const autoGenerate_1 = __importDefault(require("./../../../helper/autoGenerate"));
const caseView = (patientCase) => __awaiter(void 0, void 0, void 0, function* () {
    patientCase = lodash_1.default.pick(patientCase, [
        "caseId",
        "patientId",
        "doctorId",
        "caseDate",
        "phone",
        "fee",
        "description",
        "status",
    ]);
    return patientCase;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.PatientCase.find({
            hospitalId: req.body.hid,
            $and: [filter],
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.patientCase = yield _validation_1.PatientCase.find({
        hospitalId: req.body.hid,
        $and: [filter],
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
        email: 1,
    })
        .select({
        status: 0,
        hospitalId: 0,
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let patientCaseRecord = result.patientCase.length;
    result.lastPage = patientCaseRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let patientCase = new _validation_1.PatientCase(lodash_1.default.pick(req.body, ["patientId", "doctorId", "phone", "fee", "description"]));
    patientCase.caseId = (0, autoGenerate_1.default)(8);
    patientCase.hospitalId = req.body.hid;
    patientCase.caseDate = new Date(req.body.caseDate).toISOString();
    patientCase.createdAt = new Date().toISOString();
    patientCase.updatedAt = new Date().toISOString();
    patientCase = yield patientCase.save();
    res.status(200).json({ message: "Case added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let patientCase = yield _validation_1.PatientCase.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!patientCase)
        return res.status(400).json({ message: "No case found." });
    patientCase = lodash_1.default.assign(patientCase, lodash_1.default.pick(req.body, ["patientId", "doctorId", "phone", "fee", "description"]));
    patientCase.caseDate = new Date(req.body.caseDate).toISOString();
    patientCase.updatedAt = new Date().toISOString();
    patientCase = yield patientCase.save();
    patientCase = yield caseView(patientCase);
    res.status(200).json({ message: "Case updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let patientCase = yield _validation_1.PatientCase.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!patientCase)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.PatientCase.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Case deleted successfully." });
});
exports.remove = remove;
const IpdOpdCaselist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patientCase = yield _validation_1.PatientCase.find({
        patientId: req.body.patientId,
        hospitalId: req.body.hid,
    })
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: patientCase });
});
exports.IpdOpdCaselist = IpdOpdCaselist;
