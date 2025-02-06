import { Request, Response } from "express";
import {
  InvoiceItems,
  Invoices,
  validateAdd,
  validateDelete,
} from "./_validation";
import _ from "lodash";

const invoiceView = async (invoice: any) => {
  invoice = _.pick(invoice, [
    "invoiceId",
    "patientId",
    "invoiceDate",
    "amount",
    "status",
    "discount",
    "hospitalId",
  ]);
  return invoice;
};

export const list = async (req: Request, res: Response) => {
  let invoice = await Invoices.aggregate([
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
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let invoice: any = new Invoices(
    _.pick(req.body, ["patientId", "amount", "status", "discount", "invoiceId"])
  );

  invoice.invoiceDate = new Date(req.body.invoiceDate).toISOString();
  invoice.hospitalId = req.body.hid;
  invoice = await invoice.save();

  // Bills Item Add
  let items: any = req.body.items;

  if (items && Array.isArray(items)) {
    items.map(async (item: any) => {
      let invoiceItem: any = new InvoiceItems({
        account: item.account,
        invoiceId: invoice._id,
        description: item.description,
        quantity: item.qty,
        price: item.price,
        total: item.total,
      });

      invoiceItem = await invoiceItem.save();
    });
  }

  res.status(200).json({ message: "Invoice added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let invoice: any = await Invoices.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!invoice) return res.status(400).json({ message: "No invoice found." });

  invoice = _.assign(
    invoice,
    _.pick(req.body, ["patientId", "amount", "status", "discount"])
  );

  invoice.invoiceDate = new Date(req.body.invoiceDate).toISOString();
  invoice.hospitalId = req.body.hid;
  invoice = await invoice.save();
  invoice = await invoiceView(invoice);

  let items: any = req.body.items;

  if (items && Array.isArray(items)) {
    items.map(async (item: any) => {
      if (item._id) {
        let invoiceItem: any = await InvoiceItems.findOne({ _id: item._id });
        (invoiceItem.account = item.account),
          (invoiceItem.invoiceId = item.invoiceId),
          (invoiceItem.description = item.description),
          (invoiceItem.quantity = item.qty),
          (invoiceItem.price = item.price),
          (invoiceItem.total = item.total),
          (invoiceItem.updatedAt = new Date().toISOString());
        invoiceItem = await invoiceItem.save();
      } else {
        let invoiceItem: any = new InvoiceItems({
          account: item.account,
          invoiceId: req.body.id,
          description: item.description,
          quantity: item.qty,
          price: item.price,
          total: item.total,
        });

        invoiceItem = await invoiceItem.save();
      }
    });
  }

  res.status(200).json({ message: "Invoice updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let invoice = await Invoices.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!invoice) return res.status(400).json({ message: "No Data Found!" });

  let invoiceItem: any = await InvoiceItems.find({ invoiceId: invoice._id });
  if (invoiceItem.length > 0)
    return res.status(400).json({ message: "Remove invoice Items first." });

  await Invoices.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Invoice deleted successfully." });
};

export const removeBillItems = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let invoiceItems = await InvoiceItems.findOne({
    _id: req.body.id,
    invoiceId: req.body.invoiceId,
  });
  if (!invoiceItems) return res.status(400).json({ message: "No Data Found!" });

  await InvoiceItems.deleteOne({
    _id: req.body.id,
    invoiceId: req.body.invoiceId,
  });

  res.status(200).json({ message: "Invoice Item deleted successfully." });
};
