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
const bedTypeView = (bedType) => __awaiter(void 0, void 0, void 0, function* () {
    bedType = lodash_1.default.pick(bedType, ["hospitalId", "bedType", "description", "status"]);
    return bedType;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = req.body.pageNo ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.BedType.find({
            hospitalId: req.body.hid,
            status: true,
        }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.bedType = yield _validation_1.BedType.find({
        hospitalId: req.body.hid,
        status: true,
    })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    let bedTypeRecord = result.bedType.length;
    result.lastPage = bedTypeRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let bedTypeExist = yield _validation_1.BedType.findOne({
        bedType: req.body.bedType,
        hospitalId: req.body.hid,
    });
    if (bedTypeExist)
        return res.status(400).json({ message: "Bed type already exist." });
    let bedType = new _validation_1.BedType(lodash_1.default.pick(req.body, ["bedType", "description"]));
    bedType.hospitalId = req.body.hid;
    bedType.createdAt = new Date().toISOString();
    bedType.updatedAt = new Date().toISOString();
    bedType = yield bedType.save();
    res.status(200).json({ message: "Bed type added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let bedType = yield _validation_1.BedType.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bedType)
        return res.status(400).json({ message: "No bed type found." });
    if (bedType.bedType === req.body.bedType)
        return res.status(400).json({ message: "Bed type already exist." });
    bedType = lodash_1.default.assign(bedType, lodash_1.default.pick(req.body, ["bedType", "description"]));
    bedType.hospitalId = req.body.hid;
    bedType.updatedAt = new Date().toISOString();
    bedType = yield bedType.save();
    bedType = yield bedTypeView(bedType);
    res.status(200).json({ message: "Bed Type updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let bedType = yield _validation_1.BedType.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bedType)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.BedType.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Bed Type deleted successfully." });
});
exports.remove = remove;
