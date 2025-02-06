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
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const _validation_1 = require("./_validation");
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
        let totalRecords = yield _validation_1.Doctors.find().countDocuments();
        result.totalRecords = totalRecords;
    }
    result.doctor = yield _validation_1.Doctors.find({
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
