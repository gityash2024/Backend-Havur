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
exports.removeBillItems = exports.remove = exports.update = exports.add = exports.list = void 0;
const _validation_1 = require("./_validation");
const lodash_1 = __importDefault(require("lodash"));
const invoiceView = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    invoice = lodash_1.default.pick(invoice, [
        "invoiceId",
        "patientId",
        "invoiceDate",
        "amount",
        "status",
        "discount",
        "hospitalId",
    ]);
    return invoice;
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let invoice = yield _validation_1.Invoices.aggregate([
        {
            $lookup: {
                from: "patients", // Link to the Patients collection
                localField: "patientId",
                foreignField: "_id",
                as: "patientId",
            },
        },
        {
            $lookup: {
                from: "invoice_items", // Link to the invoice items collection
                localField: "_id", // invoice ID should match
                foreignField: "invoiceId",
                as: "invoiceItems",
            },
        },
        {
            $unwind: "$patientId",
        },
    ]);
    res.status(200).json({ data: invoice });
});
exports.list = list;
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let invoice = new _validation_1.Invoices(lodash_1.default.pick(req.body, ["patientId", "amount", "status", "discount", "invoiceId"]));
    invoice.invoiceDate = new Date(req.body.invoiceDate).toISOString();
    invoice.hospitalId = req.body.hid;
    invoice = yield invoice.save();
    // Bills Item Add
    let items = req.body.items;
    if (items && Array.isArray(items)) {
        items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let invoiceItem = new _validation_1.InvoiceItems({
                account: item.account,
                invoiceId: invoice._id,
                description: item.description,
                quantity: item.qty,
                price: item.price,
                total: item.total,
            });
            invoiceItem = yield invoiceItem.save();
        }));
    }
    res.status(200).json({ message: "Invoice added successfully." });
});
exports.add = add;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateAdd)(req.body);
    if (error)
        throw error;
    let invoice = yield _validation_1.Invoices.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!invoice)
        return res.status(400).json({ message: "No invoice found." });
    invoice = lodash_1.default.assign(invoice, lodash_1.default.pick(req.body, ["patientId", "amount", "status", "discount"]));
    invoice.invoiceDate = new Date(req.body.invoiceDate).toISOString();
    invoice.hospitalId = req.body.hid;
    invoice = yield invoice.save();
    invoice = yield invoiceView(invoice);
    let items = req.body.items;
    if (items && Array.isArray(items)) {
        items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item._id) {
                let invoiceItem = yield _validation_1.InvoiceItems.findOne({ _id: item._id });
                (invoiceItem.account = item.account),
                    (invoiceItem.invoiceId = item.invoiceId),
                    (invoiceItem.description = item.description),
                    (invoiceItem.quantity = item.qty),
                    (invoiceItem.price = item.price),
                    (invoiceItem.total = item.total),
                    (invoiceItem.updatedAt = new Date().toISOString());
                invoiceItem = yield invoiceItem.save();
            }
            else {
                let invoiceItem = new _validation_1.InvoiceItems({
                    account: item.account,
                    invoiceId: req.body.id,
                    description: item.description,
                    quantity: item.qty,
                    price: item.price,
                    total: item.total,
                });
                invoiceItem = yield invoiceItem.save();
            }
        }));
    }
    res.status(200).json({ message: "Invoice updated successfully." });
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let invoice = yield _validation_1.Invoices.findOne({
        _id: req.body.id,
        hospitalId: req.body.hid,
    });
    if (!invoice)
        return res.status(400).json({ message: "No Data Found!" });
    let invoiceItem = yield _validation_1.InvoiceItems.find({ invoiceId: invoice._id });
    if (invoiceItem.length > 0)
        return res.status(400).json({ message: "Remove invoice Items first." });
    yield _validation_1.Invoices.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });
    res.status(200).json({ message: "Invoice deleted successfully." });
});
exports.remove = remove;
const removeBillItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, _validation_1.validateDelete)(req.body);
    if (error)
        throw error;
    let invoiceItems = yield _validation_1.InvoiceItems.findOne({
        _id: req.body.id,
        invoiceId: req.body.invoiceId,
    });
    if (!invoiceItems)
        return res.status(400).json({ message: "No Data Found!" });
    yield _validation_1.InvoiceItems.deleteOne({
        _id: req.body.id,
        invoiceId: req.body.invoiceId,
    });
    res.status(200).json({ message: "Invoice Item deleted successfully." });
});
exports.removeBillItems = removeBillItems;
