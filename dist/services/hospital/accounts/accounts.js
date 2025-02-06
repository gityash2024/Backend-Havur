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
const accountView = (account) => __awaiter(void 0, void 0, void 0, function* () {
    account = lodash_1.default.pick(account, ["name", "type", "description", "status"]);
    return account;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = {};
    let totalRecords = yield _validation_1.Accounts.find({
        hospitalId: req.body.hid,
    }).countDocuments();
    result.totalRecords = totalRecords;
    result.accounts = yield _validation_1.Accounts.find({
        hospitalId: req.body.hid,
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
    let accountsExist = yield _validation_1.Accounts.findOne({
        name: req.body.name,
    });
    if (accountsExist)
        return res.status(400).json({ message: "Account already exist." });
    let account = new _validation_1.Accounts(lodash_1.default.pick(req.body, ["name", "type", "description", "status"]));
    account.hospitalId = req.body.hid;
    account.createdAt = new Date().toISOString();
    account.updatedAt = new Date().toISOString();
    account = yield account.save();
    res.status(200).json({ message: "Account added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateUpdate)(req.body);
    if (error)
        throw error;
    let account = yield _validation_1.Accounts.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!account)
        return res.status(400).json({ message: "No record found." });
    let accountExist = yield _validation_1.Accounts.findOne({
        $ne: { _id: req.body.id },
        name: req.body.name,
        hospitalId: req.body.hid,
    });
    if (accountExist)
        return res.status(400).json({ message: "Account already exist." });
    account = lodash_1.default.assign(account, lodash_1.default.pick(req.body, ["name", "type", "description", "status"]));
    account.hospitalId = req.body.hid;
    account.updatedAt = new Date().toISOString();
    account = yield account.save();
    account = yield accountView(account);
    res.status(200).json({ message: "Account updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let account = yield _validation_1.Accounts.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!account)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.Accounts.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Account deleted successfully." });
});
exports.remove = remove;
