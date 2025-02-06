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
exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const encription_1 = require("../../../helper/encription");
const usersView = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user = lodash_1.default.pick(user, [
        "firstName",
        "lastName",
        "profile",
        "dob",
        "phone",
        "hospitalId",
        "email",
        "password",
        "gender",
        "role",
    ]);
    return user;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = {};
    let totalRecords = yield _validation_1.Users.find({
        hospitalId: req.body.hid,
        status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
    result.receptionist = yield _validation_1.Users.find({
        hospitalId: req.body.hid,
        status: true,
    })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let userExist = yield _validation_1.Users.findOne({
        email: req.body.email,
    });
    if (userExist)
        return res.status(400).json({ message: "Email already exist." });
    let user = new _validation_1.Users(lodash_1.default.pick(req.body, [
        "firstName",
        "lastName",
        "profile",
        "dob",
        "phone",
        "email",
        "gender",
        "role",
    ]));
    user.password = yield (0, encription_1.encrypt)(req.body.password);
    user.hospitalId = req.body.hid;
    user.createdAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    user = yield user.save();
    res.status(200).json({ message: "Receptionist added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!user)
        return res.status(400).json({ message: "No record found." });
    let emailExist = yield _validation_1.Users.findOne({
        $ne: { _id: req.body.id },
        email: req.body.email,
        hospitalId: req.body.hid,
    });
    if (!emailExist)
        return res.status(400).json({ message: "Email already exist." });
    user = lodash_1.default.assign(user, lodash_1.default.pick(req.body, [
        "firstName",
        "lastName",
        "profile",
        "dob",
        "phone",
        "email",
        "gender",
        "role",
    ]));
    user.hospitalId = req.body.hid;
    user.updatedAt = new Date().toISOString();
    user = yield user.save();
    user = yield usersView(user);
    res.status(200).json({ message: "Receptionist updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let user = yield _validation_1.Users.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!user)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.Users.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Receptionist deleted successfully." });
});
exports.remove = remove;
