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
exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let folder = yield _validation_1.Folders.find({
        patientId: req.body.pid,
    })
        .sort({ _id: -1 }) // Or another field that defines the latest record
        .lean();
    res.status(200).json({ data: folder });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let folderExists = yield _validation_1.Folders.findOne({
        patientId: req.body.pid,
        name: req.body.name,
    });
    if (folderExists)
        return res.status(400).json({ message: "Folder already exist." });
    let folders = new _validation_1.Folders(lodash_1.default.pick(req.body, ["name"]));
    folders.patientId = req.body.pid;
    folders.createdAt = new Date().toISOString();
    folders.updatedAt = new Date().toISOString();
    folders = yield folders.save();
    res.status(200).json({ message: "Folder added successfully." });
});
exports.add = add;
