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
exports.uploadFile = exports.update = exports.view = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const upload_1 = require("../../../helper/upload");
const adminView = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    admin = lodash_1.default.pick(admin, ["userName", "emailAddress", "password"]);
    return admin;
});
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let admin = yield _validation_1.Admin.findOne({ _id: req.body.aid }).select({
        password: 0,
        verificationCode: 0,
    });
    if (!admin)
        return res.status(400).json({ message: "No record found." });
    res.status(200).json({ data: { admin: admin } });
});
exports.view = view;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let admin = yield _validation_1.Admin.findOne({ _id: req.body.aid });
    if (!admin)
        return res.status(404).json({ message: "No record found." });
    let adminuserName = yield _validation_1.Admin.findOne({ userName: req.body.userName });
    if (adminuserName)
        return res.status(400).json({ message: "UserName Already Exist" });
    let adminemailAddress = yield _validation_1.Admin.findOne({
        emailAddress: req.body.emailAddress,
    });
    if (adminemailAddress)
        return res.status(400).json({ message: "Email Id Already Exist" });
    admin = lodash_1.default.assign(admin, lodash_1.default.pick(req.body, ["userName", "emailAddress"]));
    admin.updatedAt = new Date().toISOString();
    admin = yield admin.save();
    admin = yield adminView(admin);
    res.status(200).json({ message: "Profile updated successfully." });
});
exports.update = update;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, upload_1.fileUploadHospital)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(400).json({ message: err.message });
        if (!req.body.filename)
            return res.status(400).json({ message: "Please select the file." });
        res.status(200).json({
            message: "File uploaded successfully.",
            data: {
                filename: req.body.filename,
            },
        });
    }));
});
exports.uploadFile = uploadFile;
