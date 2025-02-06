import { Request, Response } from "express";
import { Payments, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";

const paymentView = async (payment: any) => {
  payment = _.pick(payment, [
    "paymentDate",
    "accountId",
    "payTo",
    "amount",
    "description",
    "hospitalId",
  ]);
  return payment;
};

export const list = async (req: Request, res: Response) => {
  let payment = await Payments.find({
    hospitalId: req.body.hid,
  })
    .populate("accountId", { name: 1, type: 1 })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: payment });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let payment: any = new Payments(
    _.pick(req.body, ["accountId", "payTo", "amount", "description"])
  );

  payment.paymentDate = new Date(req.body.paymentDate).toISOString();
  payment.hospitalId = req.body.hid;
  payment.createdAt = new Date().toISOString();
  payment.updatedAt = new Date().toISOString();
  payment = await payment.save();

  res.status(200).json({ message: "Payment added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let payment: any = await Payments.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!payment) return res.status(400).json({ message: "No record found." });

  payment = _.assign(
    payment,
    _.pick(req.body, ["accountId", "payTo", "amount", "description"])
  );

  payment.paymentDate = new Date(req.body.paymentDate).toISOString();
  payment.hospitalId = req.body.hid;
  payment.updatedAt = new Date().toISOString();
  payment = await payment.save();
  payment = await paymentView(payment);

  res.status(200).json({ message: "Payment updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let payment = await Payments.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!payment) return res.status(400).json({ message: "No Data Found!" });

  await Payments.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Payment deleted successfully." });
};
