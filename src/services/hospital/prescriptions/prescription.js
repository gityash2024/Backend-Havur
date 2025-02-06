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
exports.removePrescriptionMedicines = exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const prescriptionView = (prescription) => __awaiter(void 0, void 0, void 0, function* () {
    prescription = lodash_1.default.pick(prescription, [
        "patientId",
        "doctorId",
        "foodAllergies",
        "tendencyBleed",
        "heartDisease",
        "highBloodPressure",
        "diabetic",
        "surgery",
        "accident",
        "others",
        "currentMedication",
        "femalePregnancy",
        "breastFeeding",
        "healthInsurance",
        "lowIncome",
        "reference",
        "status",
        "plusRate",
        "temperature",
        "problemDescription",
        "test",
        "advice",
        "nextVisitQty",
        "nextVisitTime",
    ]);
    return prescription;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all prescription, populate patient details, bill items, and admission details
        const prescription = yield _validation_1.Prescriptions.aggregate([
            {
                $lookup: {
                    from: "patients", // Link to the correct Admissions collection (check collection name)
                    localField: "patientId", // Match patientAdmissionId in the Bill schema
                    foreignField: "_id", // _id in the Admissions collection
                    as: "patientDetails",
                },
            },
            {
                $lookup: {
                    from: "doctor", // Link to the Patients collection
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctorDetails",
                },
            },
            {
                $lookup: {
                    from: "prescriptionsMedicines", // Link to the BillItems collection
                    localField: "_id", // Bill ID should match
                    foreignField: "prescriptionId",
                    as: "prescriptionItem",
                },
            },
            {
                $unwind: {
                    path: "$doctorDetails",
                    preserveNullAndEmptyArrays: true, // Allow nulls for missing doctors
                },
            },
            {
                $unwind: "$patientDetails",
            },
        ]);
        // Send the response
        res.status(200).json({ data: prescription });
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let prescription = new _validation_1.Prescriptions(lodash_1.default.pick(req.body, [
        "patientId",
        "doctorId",
        "foodAllergies",
        "tendencyBleed",
        "heartDisease",
        "highBloodPressure",
        "diabetic",
        "surgery",
        "accident",
        "others",
        "currentMedication",
        "femalePregnancy",
        "breastFeeding",
        "healthInsurance",
        "lowIncome",
        "reference",
        "status",
        "plusRate",
        "temperature",
        "problemDescription",
        "test",
        "advice",
        "nextVisitQty",
        "nextVisitTime",
    ]));
    prescription.medicalHistory = new Date(req.body.medicalHistory).toISOString();
    prescription.hospitalId = req.body.hid;
    prescription = yield prescription.save();
    // Prescription Medicines Add
    let items = req.body.items;
    if (items && Array.isArray(items)) {
        items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let prescriptionsMedicine = new _validation_1.PrescriptionsMedicines({
                medicine: item.medicine,
                prescriptionId: prescription._id,
                dosage: item.dosage,
                day: item.day,
                time: item.time,
                doseInterval: item.doseInterval,
                comment: item.comment,
            });
            prescriptionsMedicine = yield prescriptionsMedicine.save();
        }));
    }
    res.status(200).json({ message: "Prescription added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let prescription = yield _validation_1.Prescriptions.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!prescription)
        return res.status(400).json({ message: "No prescription found." });
    prescription = lodash_1.default.assign(prescription, lodash_1.default.pick(req.body, [
        "patientId",
        "doctorId",
        "foodAllergies",
        "tendencyBleed",
        "heartDisease",
        "highBloodPressure",
        "diabetic",
        "surgery",
        "accident",
        "others",
        "currentMedication",
        "femalePregnancy",
        "breastFeeding",
        "healthInsurance",
        "lowIncome",
        "reference",
        "status",
        "plusRate",
        "temperature",
        "problemDescription",
        "test",
        "advice",
        "nextVisitQty",
        "nextVisitTime",
    ]));
    prescription.medicalHistory = new Date(req.body.medicalHistory).toISOString();
    prescription.hospitalId = req.body.hid;
    prescription.updatedAt = new Date().toISOString();
    prescription = yield prescription.save();
    prescription = yield prescriptionView(prescription);
    let items = req.body.items;
    if (items && Array.isArray(items)) {
        items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item._id) {
                let prescriptionsMedicine = yield _validation_1.PrescriptionsMedicines.findOne({
                    _id: item._id,
                });
                prescriptionsMedicine.prescriptionId = item.prescriptionId;
                prescriptionsMedicine.medicine = item.medicine;
                prescriptionsMedicine.dosage = item.dosage;
                prescriptionsMedicine.day = item.day;
                prescriptionsMedicine.time = item.time;
                prescriptionsMedicine.doseInterval = item.doseInterval;
                prescriptionsMedicine.comment = item.comment;
                prescriptionsMedicine.updatedAt = new Date().toISOString();
                prescriptionsMedicine = yield prescriptionsMedicine.save();
            }
            else {
                let prescriptionsMedicine = new _validation_1.PrescriptionsMedicines({
                    medicine: item.medicine,
                    prescriptionId: req.body.id,
                    dosage: item.dosage,
                    day: item.day,
                    time: item.time,
                    doseInterval: item.doseInterval,
                    comment: item.comment,
                });
                prescriptionsMedicine = yield prescriptionsMedicine.save();
            }
        }));
    }
    res.status(200).json({ message: "Prescription updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let prescription = yield _validation_1.Prescriptions.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!prescription)
        return res.status(400).json({ message: "No Data Found!" });
    let prescriptionsMedicine = yield _validation_1.PrescriptionsMedicines.find({
        prescriptionId: prescription._id,
    });
    if (prescriptionsMedicine.length > 0)
        return res
            .status(400)
            .json({ message: "Remove Prescription medicines first." });
    yield prescription.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "prescription deleted successfully." });
});
exports.remove = remove;
const removePrescriptionMedicines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let prescriptionsMedicine = yield _validation_1.PrescriptionsMedicines.findOne({
        _id: req.body.id,
        prescriptionId: req.body.prescriptionId,
    });
    if (!prescriptionsMedicine)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.PrescriptionsMedicines.deleteOne({
        _id: req.body.id,
        prescriptionId: req.body.prescriptionId,
    });
    res
        .status(200)
        .json({ message: "Prescription medicine deleted successfully." });
});
exports.removePrescriptionMedicines = removePrescriptionMedicines;
