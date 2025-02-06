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
exports.billTransactionList = exports.removeBillItems = exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const autoGenerate_1 = __importDefault(require("../../../helper/autoGenerate"));
const billsView = (bed) => __awaiter(void 0, void 0, void 0, function* () {
    bed = lodash_1.default.pick(bed, [
        "billId",
        "patientId",
        "billDate",
        "amount",
        "status",
        "patientAdmissionId",
        "hospitalId",
    ]);
    return bed;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all bills, populate patient details, bill items, and admission details
        const bills = yield _validation_1.Bills.aggregate([
            {
                $lookup: {
                    from: "admission", // Link to the correct Admissions collection (check collection name)
                    localField: "patientAdmissionId", // Match patientAdmissionId in the Bill schema
                    foreignField: "_id", // _id in the Admissions collection
                    as: "admissionDetails",
                },
            },
            {
                $lookup: {
                    from: "patients", // Link to the Patients collection
                    localField: "patientId",
                    foreignField: "_id",
                    as: "patientDetails",
                },
            },
            {
                $lookup: {
                    from: "billItems", // Link to the BillItems collection
                    localField: "_id", // Bill ID should match
                    foreignField: "billId",
                    as: "billItems",
                },
            },
            {
                $unwind: {
                    path: "$admissionDetails",
                    preserveNullAndEmptyArrays: true, // Ensure nulls are allowed when no admission record exists
                },
            },
            {
                $lookup: {
                    from: "doctor", // Link to the Doctors collection
                    localField: "admissionDetails.doctorId", // Match doctorId from admissionDetails
                    foreignField: "_id",
                    as: "doctorDetails",
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
        res.status(200).json({ data: bills });
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let bills = new _validation_1.Bills(lodash_1.default.pick(req.body, ["patientId", "amount", "status", "patientAdmissionId"]));
    bills.billDate = new Date(req.body.billDate).toISOString();
    bills.billId = (0, autoGenerate_1.default)(8);
    bills.hospitalId = req.body.hid;
    bills = yield bills.save();
    // Bills Item Add
    let items = req.body.items;
    if (items && Array.isArray(items)) {
        items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let billsItem = new _validation_1.BillItems({
                itemName: item.name,
                billId: bills._id,
                qty: item.qty,
                price: item.price,
                amount: item.amount,
            });
            billsItem = yield billsItem.save();
        }));
    }
    // if Bill status was paid then add a bill transaction
    if (bills.status === "Paid") {
        let billTransaction = new _validation_1.BillTransaction({
            transactionId: (0, autoGenerate_1.default)(6),
            paymentType: "cash",
            amount: bills.amount,
            billId: bills._id,
            patientId: bills.patientId,
            status: "Paid",
            isManualPayment: "Yes",
            hospitalId: req.body.hid,
        });
        billTransaction = yield billTransaction.save();
    }
    res.status(200).json({ message: "Bill added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let bills = yield _validation_1.Bills.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bills)
        return res.status(400).json({ message: "No bills found." });
    bills = lodash_1.default.assign(bills, lodash_1.default.pick(req.body, [
        "patientId",
        "billDate",
        "amount",
        "status",
        "patientAdmissionId",
    ]));
    bills.hospitalId = req.body.hid;
    bills.updatedAt = new Date().toISOString();
    bills = yield bills.save();
    bills = yield billsView(bills);
    let items = req.body.items;
    if (items && Array.isArray(items)) {
        items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item._id) {
                let billItems = yield _validation_1.BillItems.findOne({ _id: item._id });
                billItems.itemsName = item.name;
                billItems.billId = item.billId;
                billItems.qty = item.qty;
                billItems.price = item.price;
                billItems.amount = item.amount;
                billItems.updatedAt = new Date().toISOString();
                billItems = yield billItems.save();
            }
            else {
                let billsItem = new _validation_1.BillItems({
                    itemName: item.name,
                    billId: req.body.id,
                    qty: item.qty,
                    price: item.price,
                    amount: item.amount,
                });
                billsItem = yield billsItem.save();
            }
        }));
    }
    if (bills.status === "Paid") {
        let billTransaction = new _validation_1.BillTransaction({
            transactionId: (0, autoGenerate_1.default)(6),
            paymentType: "cash",
            amount: bills.amount,
            billId: bills._id,
            patientId: bills.patientId,
            status: "Paid",
            isManualPayment: "Yes",
            hospitalId: req.body.hid,
        });
        billTransaction = yield billTransaction.save();
    }
    res.status(200).json({ message: "Bill updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let bills = yield _validation_1.Bills.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!bills)
        return res.status(400).json({ message: "No Data Found!" });
    let billItem = yield _validation_1.BillItems.find({ billId: bills._id });
    if (billItem.length > 0)
        return res.status(400).json({ message: "Remove Bill Items first." });
    yield _validation_1.Bills.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Bills deleted successfully." });
});
exports.remove = remove;
const removeBillItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let bills = yield _validation_1.BillItems.findOne({
        _id: req.body.id,
        billId: req.body.billId,
    });
    if (!bills)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.BillItems.deleteOne({
        _id: req.body.id,
        billId: req.body.billId,
    });
    res.status(200).json({ message: "Bill Item deleted successfully." });
});
exports.removeBillItems = removeBillItems;
const billTransactionList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billTransaction = yield _validation_1.BillTransaction.find({
        hospitalId: req.body.hid,
    })
        .populate("patientId", {
        firstName: 1,
        lastName: 1,
        mobileNumber: 1,
        emailAddress: 1,
        gender: 1,
        birthDate: 1,
    })
        .populate("billId", {
        billId: 1,
        billDate: 1,
        billStatus: 1,
    })
        .sort({ _id: -1 })
        .lean();
    res.status(200).json({ data: billTransaction });
});
exports.billTransactionList = billTransactionList;
