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
exports.update = exports.remove = exports.add = exports.view = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const encription_1 = require("../../../helper/encription");
const hospitalView = (hospital) => __awaiter(void 0, void 0, void 0, function* () {
    hospital = lodash_1.default.pick(hospital, [
        "name",
        "emailAddress",
        "mobileNumber",
        "description",
        "address",
        "location",
        "hours",
        "mrp",
        "discount",
        "total",
        "image",
        "logo",
        "type",
    ]);
    return hospital;
});
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
        let totalRecords = yield _validation_1.Hospitals.find().countDocuments();
        result.totalRecords = totalRecords;
    }
    result.hospital = yield _validation_1.Hospitals.find({ $and: [filter] })
        .select({ password: 0, verificationCode: 0 })
        .sort({ createdAt: -1, name: 1, emailAddress: 1, status: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let hospitalRecord = result.hospital.length;
    result.lastPage = hospitalRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateView)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospitals.findOne({ _id: req.body.id });
    if (!hospital)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: { hospital: hospital },
    });
});
exports.view = view;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let hospital = new _validation_1.Hospitals(lodash_1.default.pick(req.body, [
        "name",
        "emailAddress",
        "mobileNumber",
        "description",
        "address",
        "location",
        "reviews",
        "image",
        "logo",
        "type",
        "doctors",
    ]));
    hospital.password = yield (0, encription_1.encrypt)(req.body.password);
    hospital.createdAt = new Date().toISOString();
    hospital.updatedAt = new Date().toISOString();
    hospital = yield hospital.save();
    res.status(200).json({ message: "Hospital added successfully." });
});
exports.add = add;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospitals.findOne({ _id: req.body.id });
    if (!hospital)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.Hospitals.deleteOne({ _id: req.body.id });
    res.status(200).json({ message: "Hospital deleted successfully." });
});
exports.remove = remove;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospitals.findOne({ _id: req.body.hospitalId });
    if (!hospital)
        return res.status(404).json({ message: "No record found." });
    let hospitalMobile = yield _validation_1.Hospitals.findOne({
        $and: [
            { mobileNumber: req.body.mobileNumber },
            { mobileNumber: { $ne: hospital.mobileNumber } },
        ],
    });
    if (hospitalMobile)
        return res
            .status(400)
            .json({ error: { mobileNumber: "Mobile No. is already exists." } });
    let hospitalEmail = yield _validation_1.Hospitals.findOne({
        $and: [
            { emailAddress: req.body.emailAddress },
            { emailAddress: { $ne: hospital.emailAddress } },
        ],
    });
    if (hospitalEmail)
        return res
            .status(400)
            .json({ error: { mobileNumber: "Email Id  is already exists." } });
    hospital = lodash_1.default.assign(hospital, lodash_1.default.pick(req.body, [
        "name",
        "emailAddress",
        "mobileNumber",
        "description",
        "address",
        "location",
        "image",
        "logo",
        "type",
    ]));
    hospital.updatedAt = new Date().toISOString();
    hospital = yield hospital.save();
    hospital = yield hospitalView(hospital);
    res.status(200).json({ message: "Hospital updated successfully." });
});
exports.update = update;
