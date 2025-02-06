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
const encription_1 = require("../../../helper/encription");
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    if (req.body.password != req.body.confirmPassword)
        return res
            .status(400)
            .json({ message: "Password and Confirm Password should be same" });
    const emailExist = yield _validation_1.Patient.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (emailExist)
        return res.status(400).json({ message: "Email already exists." });
    const mobileExist = yield _validation_1.Patient.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (mobileExist)
        return res.status(400).json({ message: "Mobile Number already exists." });
    let patient = new _validation_1.Patient(lodash_1.default.pick(req.body, [
        "firstName",
        "middleName",
        "lastName",
        "birthDate",
        "age",
        "gender",
        "wedding",
        "language",
        "religion",
        "weight",
        "height",
        "maritialStatus",
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
        "remark",
    ]));
    patient.birthDate = new Date(req.body.birthDate).toISOString();
    patient.password = yield (0, encription_1.encrypt)(req.body.password);
    patient.address.address = req.body.address;
    patient.address.area = req.body.area;
    patient.address.state = req.body.state;
    patient.address.city = req.body.city;
    patient.communication.residence = req.body.residence;
    patient.communication.office = req.body.office;
    patient.communication.other = req.body.other;
    patient.createdAt = new Date().toISOString();
    patient.updatedAt = new Date().toISOString();
    patient.status = "success";
    patient = yield patient.save();
    res.status(200).json({ message: "patient added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 40;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.firstName) {
        filter["firstName"] = req.body.firstName;
    }
    if (req.body.lastName) {
        filter["lastName"] = req.body.lastName;
    }
    if (req.body.middleName) {
        filter["middleName"] = req.body.middleName;
    }
    if (req.body.emailAddress) {
        filter["emailAddress"] = req.body.emailAddress;
    }
    if (req.body.mobileNumber) {
        filter["mobileNumber"] = req.body.mobileNumber;
    }
    if (req.body.gender) {
        filter["gender"] = req.body.gender;
    }
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Patient.find({
            $and: [filter],
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.patient = yield _validation_1.Patient.find({ $and: [filter] })
        .select({ password: 0, status: 0, verificationCode: 0, mFile: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let patientRecord = result.patient.length;
    result.lastPage = patientRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
