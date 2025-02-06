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
const paymentView = (payment) => __awaiter(void 0, void 0, void 0, function* () {
    payment = lodash_1.default.pick(payment, [
        "date",
        "patientId",
        "receiptNo",
        "amount",
        "hospitalId",
    ]);
    return payment;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payment = yield _validation_1.AdvancePayment.find({
        hospitalId: req.body.hid,
    })
        .populate("patientId", {
        firstName: 1,
        lastName: 1,
        mobileNumber: 1,
        emailAddress: 1,
    })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: payment });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let payment = new _validation_1.AdvancePayment(lodash_1.default.pick(req.body, ["patientId", "receiptNo", "amount"]));
    payment.paymentDate = new Date(req.body.paymentDate).toISOString();
    payment.hospitalId = req.body.hid;
    payment.createdAt = new Date().toISOString();
    payment.updatedAt = new Date().toISOString();
    payment = yield payment.save();
    res.status(200).json({ message: "Advance payment added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let payment = yield _validation_1.AdvancePayment.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!payment)
        return res.status(400).json({ message: "No record found." });
    payment = lodash_1.default.assign(payment, lodash_1.default.pick(req.body, ["patientId", "receiptNo", "amount"]));
    payment.paymentDate = new Date(req.body.paymentDate).toISOString();
    payment.hospitalId = req.body.hid;
    payment.updatedAt = new Date().toISOString();
    payment = yield payment.save();
    payment = yield paymentView(payment);
    res.status(200).json({ message: "Advance payment updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let payment = yield _validation_1.AdvancePayment.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!payment)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.AdvancePayment.deleteOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    res.status(200).json({ message: "Advance payment deleted successfully." });
});
exports.remove = remove;
