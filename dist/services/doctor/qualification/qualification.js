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
    let qualification = yield _validation_1.Qualification.findOne({
        name: req.body.name,
    });
    if (qualification)
        return res.status(400).json({ message: "Qualification already exist." });
    let qualifications = new _validation_1.Qualification(lodash_1.default.pick(req.body, ["name"]));
    qualifications.createdAt = new Date().toISOString();
    qualifications.updatedAt = new Date().toISOString();
    qualifications = yield qualifications.save();
    res.status(200).json({ message: "Qualification added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const qualification = yield _validation_1.Qualification.find()
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: qualification });
});
exports.list = list;
