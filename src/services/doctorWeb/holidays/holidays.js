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
exports.remove = exports.list = exports.add = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let holidays = new _validation_1.Holidays(lodash_1.default.pick(req.body, ["notes"]));
    holidays.holidaydate = new Date(req.body.holidaydate).toISOString();
    holidays.doctorId = req.body.did;
    holidays.createdAt = new Date().toISOString();
    holidays.updatedAt = new Date().toISOString();
    holidays = yield holidays.save();
    res.status(200).json({ message: "Holidays added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const holidays = yield _validation_1.Holidays.find({
        doctorId: req.body.did,
    })
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: holidays });
});
exports.list = list;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let holidays = yield _validation_1.Holidays.findOne({
        _id: req.body.id,
        doctorId: req.body.did,
    });
    if (!holidays)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.Holidays.deleteOne({ _id: req.body.id, doctorId: req.body.did });
    res.status(200).json({ message: "Holidays deleted successfully." });
});
exports.remove = remove;
