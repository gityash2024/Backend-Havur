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
exports.list = exports.associatedHospitals = exports.joinHospital = void 0;
const _validation_1 = require("./_validation");
const mongoose_1 = __importDefault(require("mongoose"));
const joinHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateJoinhospital)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospital.findOne({ _id: req.body.hid }).select({
        password: 0,
        verificationCode: 0,
        status: 0,
    });
    if (!hospital)
        return res.status(400).json({ message: "No record found." });
    const newHospital = {
        _id: req.body.hid,
    };
    let doctor = yield _validation_1.Doctor.findOne({ _id: req.body.did });
    if (!doctor.hospitalId.some((hospital) => hospital._id === new mongoose_1.default.Types.ObjectId(req.body.hid))) {
        doctor.hospitalId.push(newHospital);
        yield doctor.save();
        res.status(200).json({ message: "Request to Hospital Successfully" });
    }
    else {
        return res.status(400).json({ message: "Hospital Requested already..." });
    }
});
exports.joinHospital = joinHospital;
const associatedHospitals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let doctor = yield _validation_1.Doctor.findOne({ _id: req.body.did });
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.name) {
        filter["name"] = req.body.name;
    }
    if (req.body.emailAddress) {
        filter["emailAddress"] = req.body.emailAddress;
    }
    if (req.body.mobileNumber) {
        filter["mobileNumber"] = req.body.mobileNumber;
    }
    if (req.body.location) {
        filter["location"] = req.body.location;
    }
    let result = {};
    const hospitalIds = doctor.hospitalId.map((hospital) => hospital._id);
    result.hospital = yield _validation_1.Hospital.find({
        _id: { $in: hospitalIds },
        $and: [filter],
    })
        .select({ password: 0, verificationCode: 0 })
        .sort({ name: 1, emailAddress: 1, status: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Hospital.find({
            _id: { $in: hospitalIds },
            $and: [filter],
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    let hospitalRecord = result.hospital.length;
    result.lastPage = hospitalRecord <= recordPerPage ? true : false;
    res.status(200).json({
        data: result,
    });
});
exports.associatedHospitals = associatedHospitals;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.name) {
        filter["name"] = req.body.name;
    }
    if (req.body.emailAddress) {
        filter["emailAddress"] = req.body.emailAddress;
    }
    if (req.body.mobileNumber) {
        filter["mobileNumber"] = req.body.mobileNumber;
    }
    if (req.body.location) {
        filter["location"] = req.body.location;
    }
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Hospital.find({
            $and: [filter],
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.hospital = yield _validation_1.Hospital.find({ $and: [filter] })
        .select({ password: 0, verificationCode: 0 })
        .sort({ name: 1, emailAddress: 1, status: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let hospitalRecord = result.hospital.length;
    result.lastPage = hospitalRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
