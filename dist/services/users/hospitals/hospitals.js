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
exports.associatedDoctors = exports.view = exports.list = void 0;
const _validation_1 = require("./_validation");
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = (req.body.pageNo) ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.name) {
        filter['name'] = req.body.name;
    }
    if (req.body.emailAddress) {
        filter['emailAddress'] = req.body.emailAddress;
    }
    if (req.body.mobileNumber) {
        filter['mobileNumber'] = req.body.mobileNumber;
    }
    if (req.body.location) {
        filter['location'] = req.body.location;
    }
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Hospital.find().countDocuments();
        result.totalRecords = totalRecords;
    }
    result.hospital = yield _validation_1.Hospital.find({ $and: [filter] }).select({ password: 0, verificationCode: 0 }).sort({ name: 1, emailAddress: 1, status: 1 }).skip(skip).limit(limit).lean();
    let hospitalRecord = result.hospital.length;
    result.lastPage = hospitalRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.list = list;
const view = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateView)(req.body);
    if (error)
        throw error;
    let hospital = yield _validation_1.Hospital.findOne({ _id: req.body.hid }).select({ password: 0, verificationCode: 0 });
    if (!hospital)
        return res.status(404).json({ message: 'No record found.' });
    res.status(200).json({
        data: { hospital: hospital }
    });
});
exports.view = view;
// export const associatedDoctors = async (req: Request, res: Response) => {
//     const { error } = validateView(req.body);
//     if (error) throw error;
//     const hospital = await Hospitals.aggregate([
//         {
//           $match: { _id: new Types.ObjectId(req.body.id)}
//         },
//         {
//           $lookup: {
//             from: 'doctor',
//             localField: 'doctors._id',
//             foreignField: '_id',
//             as: 'doctorData'
//           }
//         },
//         { $unwind: '$doctorData' },
//         {
//           $group: {
//             _id: '$_id',
//             doctorData: { $push: '$doctorData' }
//           }
//         }
//       ]);
//     res.status(200).json({
//         data: hospital[0]
//     });
// };
const associatedDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pageNo = (req.body.pageNo) ? req.body.pageNo : 1;
    let recordPerPage = 15;
    let skip = (pageNo - 1) * recordPerPage;
    let limit = recordPerPage;
    let filter = new Object();
    if (req.body.firstName) {
        filter['firstName'] = req.body.firstName;
    }
    if (req.body.lastName) {
        filter['lastName'] = req.body.lastName;
    }
    if (req.body.department) {
        filter['department'] = req.body.department;
    }
    if (req.body.designation) {
        filter['designation'] = req.body.designation;
    }
    if (req.body.emailId) {
        filter['emailId'] = req.body.emailId;
    }
    if (req.body.mobileNumber) {
        filter['mobileNumber'] = req.body.mobileNumber;
    }
    if (req.body.gender) {
        filter['gender'] = req.body.gender;
    }
    if (req.body.city) {
        filter['city'] = req.body.city;
    }
    if (req.body.status) {
        filter['hospitalId.hospitalStatus'] = req.body.status;
    }
    let result = {};
    if (pageNo === 1) {
        let totalRecords = yield _validation_1.Doctor.find({ 'hospitalId._id': req.body.hid, $and: [filter] }).countDocuments();
        result.totalRecords = totalRecords;
    }
    result.doctor = yield _validation_1.Doctor.find({ 'hospitalId._id': req.body.hid, $and: [filter] }).select({ password: 0, otp: 0, status: 0, requestType: 0, requestStatus: 0, hospitalId: 0, createdAt: 0, updatedAt: 0, __v: 0 }).sort({ firstName: 1, lastName: 1, emailId: 1, department: 1, designation: 1, mobileNumber: 1, gender: 1 }).skip(skip).limit(limit).lean();
    let doctorRecord = result.doctor.length;
    result.lastPage = doctorRecord <= recordPerPage ? true : false;
    res.status(200).json({ data: result });
});
exports.associatedDoctors = associatedDoctors;
