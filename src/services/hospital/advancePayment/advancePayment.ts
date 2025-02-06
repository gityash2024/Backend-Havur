import { Request, Response } from "express";
import { AdvancePayment, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";

const paymentView = async (payment: any) => {
  payment = _.pick(payment, [
    "date",
    "patientId",
    "receiptNo",
    "amount",
    "hospitalId",
  ]);
  return payment;
};

export const list = async (req: Request, res: Response) => {
  let payment = await AdvancePayment.find({
    hospitalId: req.body.hid,
  })
    .populate("patientId", {
      firstName: 1,
      lastName: 1,
      mobileNumber: 1,
      emailAddress: 1,
    })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: payment });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let payment: any = new AdvancePayment(
    _.pick(req.body, ["patientId", "receiptNo", "amount"])
  );

  payment.paymentDate = new Date(req.body.paymentDate).toISOString();
  payment.hospitalId = req.body.hid;
  payment.createdAt = new Date().toISOString();
  payment.updatedAt = new Date().toISOString();
  payment = await payment.save();

  res.status(200).json({ message: "Advance payment added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let payment: any = await AdvancePayment.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!payment) return res.status(400).json({ message: "No record found." });

  payment = _.assign(
    payment,
    _.pick(req.body, ["patientId", "receiptNo", "amount"])
  );

  payment.paymentDate = new Date(req.body.paymentDate).toISOString();
  payment.hospitalId = req.body.hid;
  payment.updatedAt = new Date().toISOString();
  payment = await payment.save();
  payment = await paymentView(payment);

  res.status(200).json({ message: "Advance payment updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let payment = await AdvancePayment.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!payment) return res.status(400).json({ message: "No Data Found!" });

  await AdvancePayment.deleteOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });

  res.status(200).json({ message: "Advance payment deleted successfully." });
};
