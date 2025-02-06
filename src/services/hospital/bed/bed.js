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
exports.bedTypelist = exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const autoGenerate_1 = __importDefault(require("../../../helper/autoGenerate"));
const bedView = (bed) => __awaiter(void 0, void 0, void 0, function* () {
    bed = lodash_1.default.pick(bed, [
        "name",
        "hospitalId",
        "bedType",
        "description",
        "charge",
        "available",
        "status",
    ]);
    return bed;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Bed.find({
            hospitalId: req.body.hid,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.bed = yield _validation_1.Bed.find({
        hospitalId: req.body.hid,
        status: true,
    })
        .populate("bedType", { bedType: 1 })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let bedRecord = result.bed.length;
    result.lastPage = bedRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let nameExist = yield _validation_1.Bed.findOne({
        name: req.body.name,
        bedType: req.body.bedType,
        hospitalId: req.body.hid,
    });
    if (nameExist)
        return res.status(400).json({ message: "Name already exist." });
    let bed = new _validation_1.Bed(lodash_1.default.pick(req.body, ["name", "bedType", "description", "charge", "status"]));
    bed.bedId = (0, autoGenerate_1.default)(8);
    bed.available = "no";
    bed.hospitalId = req.body.hid;
    bed.createdAt = new Date().toISOString();
    bed.updatedAt = new Date().toISOString();
    bed = yield bed.save();
    res.status(200).json({ message: "Bed added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let bed = yield _validation_1.Bed.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bed)
        return res.status(400).json({ message: "No bed type found." });
    if (bed.name === req.body.name)
        return res.status(400).json({ message: "Name already exist." });
    bed = lodash_1.default.assign(bed, lodash_1.default.pick(req.body, ["name", "bedType", "description", "charge", "status"]));
    bed.hospitalId = req.body.hid;
    bed.updatedAt = new Date().toISOString();
    bed = yield bed.save();
    bed = yield bedView(bed);
    res.status(200).json({ message: "Bed updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let bed = yield _validation_1.Bed.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bed)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.Bed.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Bed deleted successfully." });
});
exports.remove = remove;
const bedTypelist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bed = yield _validation_1.Bed.find({
        bedType: req.body.bedType,
        hospitalId: req.body.hid,
    })
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: bed });
});
exports.bedTypelist = bedTypelist;
