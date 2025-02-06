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
exports.deleteFile = exports.uploadFile = exports.update = exports.view = void 0;
const _validation_1 = require("./_validation");
const upload_1 = require("../../../helper/upload");
const lodash_1 = __importDefault(require("lodash"));
const usersView = (users) => __awaiter(void 0, void 0, void 0, function* () {
    users = lodash_1.default.pick(users, ["firstName", "lastName", "profile", "dob", "phone"]);
    return users;
});
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield _validation_1.Users.findOne({ _id: req.body.uid })
        .select({
        password: 0,
        otp: 0,
        status: 0,
    })
        .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 });
    if (!user)
        return res.status(400).json({ message: "No record found." });
    res.status(200).json({ data: user });
});
exports.view = view;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({ _id: req.body.uid });
    if (!user)
        return res.status(404).json({ message: "No record found." });
    user = lodash_1.default.assign(user, lodash_1.default.pick(req.body, ["firstName", "lastName", "profile", "dob", "phone"]));
    user.updatedAt = new Date().toISOString();
    user = yield user.save();
    user = yield usersView(user);
    res.status(200).json({ message: "Profile updated successfully." });
});
exports.update = update;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, upload_1.fileUpload)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
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
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.filename || req.body.filename === "")
        return res.status(400).json({ message: "File is not selected." });
    const isDelete = yield (0, upload_1.fileDelete)(req.body.filename);
    if (!isDelete) {
        return res.status(404).json({ message: "No File Found" });
    }
    res.status(200).json({ message: "File deleted successfully." });
});
exports.deleteFile = deleteFile;
