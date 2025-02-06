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
exports.list = exports.add = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let specialization = yield _validation_1.Specialization.findOne({
        name: req.body.name,
    });
    if (specialization)
        return res.status(400).json({ message: "Specialization already exist." });
    let speciality = new _validation_1.Specialization(lodash_1.default.pick(req.body, ["name"]));
    speciality.createdAt = new Date().toISOString();
    speciality.updatedAt = new Date().toISOString();
    speciality = yield speciality.save();
    res.status(200).json({ message: "Specialization added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const specialization = yield _validation_1.Specialization.find()
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: specialization });
});
exports.list = list;
