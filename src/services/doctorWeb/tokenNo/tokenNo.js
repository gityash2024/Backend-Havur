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
exports.HospitalCurrentToken = exports.currentToken = exports.countTokensToday = exports.list = exports.add = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
// import { startOfDay } from "date-fns";
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let tokenNo = new _validation_1.TokenNo(lodash_1.default.pick(req.body, ["tokenNo", "hospitalId"]));
    tokenNo.doctorId = req.body.did;
    tokenNo.date = new Date(req.body.date).toISOString();
    tokenNo.createdAt = new Date().toISOString();
    tokenNo.updatedAt = new Date().toISOString();
    tokenNo = yield tokenNo.save();
    res.status(200).json({ message: "Token no added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 100;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.TokenNo.find({
            doctorId: req.body.did,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.tokenNo = yield _validation_1.TokenNo.find({
        doctorId: req.body.did,
        status: true,
    })
        .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let tokenNoRecord = result.tokenNo.length;
    result.lastPage = tokenNoRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
// export const countTokensToday = async (req: Request, res: Response) => {
//   // Get the start and end of the current day
//   const startDate = startOfDay(new Date());
//   // const endDate = endOfDay(new Date());
//   // Count the total tokens for the given doctor and hospital on the current day
//   const totalTokensToday = await Appointment.find({
//     doctorId: req.body.did,
//     createdAt: { $gte: startDate },
//     status: true,
//   }).countDocuments();
//   res.status(200).json({ data: totalTokensToday });
// };
const countTokensToday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the start and end of the current day in UTC
    const now = new Date();
    const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    // Count the total tokens for the given doctor and hospital on the current day
    const totalTokensToday = yield _validation_1.Appointment.find({
        doctorId: req.body.did,
        createdAt: { $gte: startDate, $lte: endDate },
        status: true,
    }).countDocuments();
    res.status(200).json({ data: totalTokensToday });
});
exports.countTokensToday = countTokensToday;
const currentToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let latestToken = yield _validation_1.TokenNo.findOne({
        doctorId: req.body.did, // Assuming hid is sent in the request body
        status: true,
    })
        .sort({ _id: -1 }) // Or another field that defines the latest record
        .lean();
    res.status(200).json({ data: latestToken.tokenNo });
});
exports.currentToken = currentToken;
const HospitalCurrentToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let latestToken = yield _validation_1.TokenNo.findOne({
        doctorId: req.body.did,
        hospitalId: req.body.hospitalId, // Assuming hid is sent in the request body
        status: true,
    })
        .sort({ _id: -1 }) // Or another field that defines the latest record
        .lean();
    res.status(200).json({ data: latestToken });
});
exports.HospitalCurrentToken = HospitalCurrentToken;
