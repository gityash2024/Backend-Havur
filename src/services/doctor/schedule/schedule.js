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
exports.addSchedule = exports.update = exports.list = exports.add = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let schedule = new _validation_1.Schedule(lodash_1.default.pick(req.body, [
        "patientPerTime",
        "day",
        "availableFrom",
        "availableTo",
        "hospitalId",
    ]));
    schedule.doctorId = req.body.did;
    schedule.createdAt = new Date().toISOString();
    schedule.updatedAt = new Date().toISOString();
    schedule = yield schedule.save();
    res.status(200).json({ message: "Schedule added successfully." });
});
exports.add = add;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schedule = yield _validation_1.Schedule.find({
        hospitalId: req.body.hospitalId,
        doctorId: req.body.did,
    })
        .populate("hospitalId", { name: 1, mobileNumber: 1, emailAddress: 1 })
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: schedule });
});
exports.list = list;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let schedules = yield _validation_1.Schedule.findOne({ _id: req.body.id });
    if (!schedules)
        return res.status(404).json({ message: "No record found." });
    schedules = lodash_1.default.assign(schedules, lodash_1.default.pick(req.body, ["hospitalId", "patientPerTime", "shifts"]));
    schedules.scheduleDate = new Date(req.body.scheduleDate).toISOString();
    schedules.doctorId = req.body.did;
    schedules.updatedAt = new Date().toISOString();
    schedules = yield schedules.save();
    res.status(200).json({ message: "Schedule updated successfully." });
});
exports.update = update;
const addSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSchedule = yield _validation_1.Schedule.findOne({
        doctorId: req.body.did,
        hospitalId: req.body.hospitalId,
        scheduleDate: req.body.scheduleDate,
    });
    if (existingSchedule) {
        return res.status(400).json({
            message: "A schedule already exists for this doctor, hospital, and date.",
        });
    }
    const scheduleData = lodash_1.default.pick(req.body, [
        "hospitalId",
        "patientPerTime",
        "shifts",
    ]);
    // Check if a schedule already exists for the given doctorId, hospitalId, and scheduleDate
    const schedule = new _validation_1.Schedule(Object.assign(Object.assign({}, scheduleData), { scheduleDate: new Date(req.body.scheduleDate).toISOString(), doctorId: req.body.did, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
    yield schedule.save();
    res.status(200).json({ message: "Schedule added successfully." });
});
exports.addSchedule = addSchedule;
