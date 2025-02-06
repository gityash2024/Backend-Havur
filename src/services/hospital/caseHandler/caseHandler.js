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
const caseHandlerView = (handler) => __awaiter(void 0, void 0, void 0, function* () {
    handler = lodash_1.default.pick(handler, [
        "firstName",
        "lastName",
        "email",
        "designation",
        "phone",
        "gender",
        "qualification",
        "birthDate",
        "bloodGroup",
        "password",
        "profile",
        "address1",
        "address2",
        "city",
        "zip",
        "status",
    ]);
    return handler;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.status) {
        filter["status"] = req.body.status;
    }
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.CaseHandler.find({
            hospitalId: req.body.hid,
            $and: [filter],
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.caseHandler = yield _validation_1.CaseHandler.find({
        hospitalId: req.body.hid,
        $and: [filter],
    })
        .select({
        status: 0,
        hospitalId: 0,
        password: 0,
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let caseHandlerRecord = result.caseHandler.length;
    result.lastPage = caseHandlerRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let emailExist = yield _validation_1.CaseHandler.findOne({
        email: req.body.email,
        hospitalId: req.body.hid,
    });
    if (emailExist)
        return res.status(400).json({ message: "Email already exist." });
    let phoneExist = yield _validation_1.CaseHandler.findOne({
        phone: req.body.phone,
        hospitalId: req.body.hid,
    });
    if (phoneExist)
        return res.status(400).json({ message: "Phone already exist." });
    let caseHandler = new _validation_1.CaseHandler(lodash_1.default.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "designation",
        "phone",
        "gender",
        "qualification",
        "bloodGroup",
        "profile",
        "address1",
        "address2",
        "city",
        "zip",
        "status",
    ]));
    caseHandler.hospitalId = req.body.hid;
    caseHandler.password = yield (0, encription_1.encrypt)(req.body.password);
    caseHandler.birthDate = new Date(req.body.birthDate).toISOString();
    caseHandler.createdAt = new Date().toISOString();
    caseHandler.updatedAt = new Date().toISOString();
    caseHandler = yield caseHandler.save();
    res.status(200).json({ message: "Case handler added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let caseHandler = yield _validation_1.CaseHandler.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!caseHandler)
        return res.status(400).json({ message: "No case found." });
    if (caseHandler.email === req.body.email)
        return res.status(400).json({ message: "Email already exist." });
    if (caseHandler.phone === req.body.phone)
        return res.status(400).json({ message: "Phone already exist." });
    caseHandler = lodash_1.default.assign(caseHandler, lodash_1.default.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "designation",
        "phone",
        "gender",
        "qualification",
        "bloodGroup",
        "profile",
        "address1",
        "address2",
        "city",
        "zip",
        "status",
    ]));
    caseHandler.birthDate = new Date(req.body.birthDate).toISOString();
    caseHandler.updatedAt = new Date().toISOString();
    caseHandler = yield caseHandler.save();
    caseHandler = yield caseHandlerView(caseHandler);
    res.status(200).json({ message: "Case handler updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let caseHandler = yield _validation_1.CaseHandler.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!caseHandler)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.CaseHandler.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Case handler deleted successfully." });
});
exports.remove = remove;
