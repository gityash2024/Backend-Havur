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
exports.acceptDoctor = exports.list = exports.add = void 0;
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
    const emailExist = yield _validation_1.Doctors.findOne({ email: req.body.email });
    if (emailExist)
        return res.status(400).json({ message: "Email already exists." });
    const mobileExist = yield _validation_1.Doctors.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (mobileExist)
        return res.status(400).json({ message: "Mobile Number already exists." });
    let doctor = new _validation_1.Doctors(lodash_1.default.pick(req.body, [
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
        "age",
    ]));
    doctor.password = yield (0, encription_1.encrypt)(req.body.password);
    doctor.shareIn.opd = req.body.opd;
    doctor.shareIn.indoorVisite = req.body.indoorVisite;
    doctor.shareIn.operation = req.body.operation;
    doctor.shareIn.procedure = req.body.procedure;
    doctor.clinicDetails.cName = req.body.cName;
    doctor.clinicDetails.address = req.body.address;
    doctor.clinicDetails.area = req.body.area;
    doctor.clinicDetails.city = req.body.city;
    doctor.clinicDetails.pin = req.body.pin;
    doctor.clinicDetails.state = req.body.state;
    doctor.clinicDetails.country = req.body.country;
    doctor.clinicDetails.cPhone = req.body.cPhone;
    doctor.createdAt = new Date().toISOString();
    doctor.updatedAt = new Date().toISOString();
    doctor.hospitalId = [{ _id: req.body.hid, hospitalStatus: "success" }];
    doctor = yield doctor.save();
    res.status(200).json({ message: "doctor added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.firstName) {
        filter["firstName"] = req.body.firstName;
    }
    if (req.body.lastName) {
        filter["lastName"] = req.body.lastName;
    }
    if (req.body.department) {
        filter["department"] = req.body.department;
    }
    if (req.body.designation) {
        filter["designation"] = req.body.designation;
    }
    if (req.body.emailId) {
        filter["emailId"] = req.body.emailId;
    }
    if (req.body.mobileNumber) {
        filter["mobileNumber"] = req.body.mobileNumber;
    }
    if (req.body.gender) {
        filter["gender"] = req.body.gender;
    }
    if (req.body.city) {
        filter["city"] = req.body.city;
    }
    if (req.body.status) {
        filter["hospitalId.hospitalStatus"] = req.body.status;
    }
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Doctors.find({
            "hospitalId._id": req.body.hid,
            $and: [filter],
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.doctor = yield _validation_1.Doctors.find({
        "hospitalId._id": req.body.hid,
        $and: [filter],
    })
        .select({
        password: 0,
        otp: 0,
        status: 0,
        requestType: 0,
        requestStatus: 0,
        hospitalId: 0,
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let doctorRecord = result.doctor.length;
    result.lastPage = doctorRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const acceptDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAcceptdoctor)(req.body);
    if (error)
        throw error;
    let doctor = yield _validation_1.Doctors.findOne({
        "hospitalId._id": req.body.hid,
        _id: req.body.did,
        "hospitalId.hospitalStatus": "pending",
    });
    if (!doctor)
        return res.status(404).json({ message: "No record found." });
    for (let i = 0; i < doctor.hospitalId.length; i++) {
        if (doctor.hospitalId[i]._id.toString() === req.body.hid) {
            doctor.hospitalId[i].hospitalStatus = "success";
            break;
        }
    }
    doctor.updatedAt = new Date().toISOString();
    doctor = yield doctor.save();
    res.status(200).json({ message: "Doctor Request Accepeted Successfully..." });
});
exports.acceptDoctor = acceptDoctor;
