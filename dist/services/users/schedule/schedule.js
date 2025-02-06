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
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const _validation_1 = require("./_validation");
const getStartAndEndOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(now);
    const endOfWeek = new Date(now);
    // Adjust to get the start of the week (Monday)
    startOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    // Adjust to get the end of the week (Sunday)
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
};
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
    let result = {};
    result.holidays = yield _validation_1.Holidays.find({
        doctorId: req.body.doctorId,
        date: { $gte: startOfWeek, $lte: endOfWeek },
    });
    result.schedule = yield _validation_1.Schedule.find({
        hospitalId: req.body.hospitalId,
        doctorId: req.body.doctorId,
    })
        .select({
        status: 0,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({ data: result });
});
exports.list = list;
