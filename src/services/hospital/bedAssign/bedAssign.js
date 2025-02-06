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
const bedAssignView = (bed) => __awaiter(void 0, void 0, void 0, function* () {
    bed = lodash_1.default.pick(bed, ["case", "ipdPatient", "bed", "date", "description"]);
    return bed;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.BedAssign.find({
            hospitalId: req.body.hid,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.bedAssign = yield _validation_1.BedAssign.find({
        hospitalId: req.body.hid,
        status: true,
    })
        .populate("case", { caseId: 1, caseDate: 1, patientId: 1 })
        .populate("ipdPatient", { ipdNo: 1, admissionDate: 1, patientId: 1 })
        .populate("bed", {
        bedId: 1,
        name: 1,
        available: 1,
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let bedAssign = result.bedAssign.length;
    result.lastPage = bedAssign <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let nameExist = yield _validation_1.BedAssign.findOne({
        case: req.body.case,
        ipdPatient: req.body.ipdPatient,
        hospitalId: req.body.hid,
    });
    if (nameExist)
        return res.status(400).json({ message: "Bed already assign." });
    let bed = new _validation_1.BedAssign(lodash_1.default.pick(req.body, ["case", "ipdPatient", "bed", "description"]));
    bed.date = new Date(req.body.date).toISOString();
    bed.hospitalId = req.body.hid;
    bed.createdAt = new Date().toISOString();
    bed.updatedAt = new Date().toISOString();
    bed = yield bed.save();
    res.status(200).json({ message: "Bed assign successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let bed = yield _validation_1.BedAssign.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bed)
        return res.status(400).json({ message: "No bed Assign found." });
    if (bed.case === req.body.case)
        return res.status(400).json({ message: "Assign already exist." });
    bed = lodash_1.default.assign(bed, lodash_1.default.pick(req.body, ["case", "ipdPatient", "bed", "description"]));
    bed.dischargeDate = new Date(req.body.dischargeDate).toISOString();
    bed.date = new Date(req.body.date).toISOString();
    bed.hospitalId = req.body.hid;
    bed.updatedAt = new Date().toISOString();
    bed = yield bed.save();
    bed = yield bedAssignView(bed);
    res.status(200).json({ message: "Bed Assign updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let bed = yield _validation_1.BedAssign.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bed)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.BedAssign.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Assign deleted successfully." });
});
exports.remove = remove;
