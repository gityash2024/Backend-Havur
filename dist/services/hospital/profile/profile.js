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
exports.update = exports.view = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
// import { encrypt } from "../../../helper/encription";
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
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateView)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospitals.findOne({ _id: req.body.hid });
    if (!hospital)
        return res.status(404).json({ message: "No record found." });
    res.status(200).json({
        data: { hospital: hospital },
    });
});
exports.view = view;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let hospitalMobile = yield _validation_1.Hospitals.findOne({
        mobileNumber: req.body.mobileNumber,
    });
    if (hospitalMobile)
        return res
            .status(400)
            .json({ error: { mobileNumber: "Mobile No. is already exists." } });
    let hospitalEmail = yield _validation_1.Hospitals.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (hospitalEmail)
        return res
            .status(400)
            .json({ error: { mobileNumber: "Email Id  is already exists." } });
    let hospital = yield _validation_1.Hospitals.findOne({ _id: req.body.hid });
    if (!hospital)
        return res.status(404).json({ message: "No record found." });
    hospital = lodash_1.default.assign(hospital, lodash_1.default.pick(req.body, [
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
    ]));
    hospital.updatedAt = new Date().toISOString();
    hospital = yield hospital.save();
    hospital = yield hospitalView(hospital);
    res.status(200).json({ message: "Hospital updated successfully." });
});
exports.update = update;
