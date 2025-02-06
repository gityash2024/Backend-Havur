import { Request, Response } from "express";
import {
  Accounts,
  validateAdd,
  validateDelete,
  validateUpdate,
} from "./_validation";
import _ from "lodash";

const accountView = async (account: any) => {
  account = _.pick(account, ["name", "type", "description", "status"]);
  return account;
};

export const list = async (req: Request, res: Response) => {
  let result: any = {};
  let totalRecords: number = await Accounts.find({
    hospitalId: req.body.hid,
  }).countDocuments();
  result.totalRecords = totalRecords;

  result.accounts = await Accounts.find({
    hospitalId: req.body.hid,
  })
    .sort({ _id: -1 })
    .lean();

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let accountsExist: any = await Accounts.findOne({
    name: req.body.name,
  });
  if (accountsExist)
    return res.status(400).json({ message: "Account already exist." });

  let account: any = new Accounts(
    _.pick(req.body, ["name", "type", "description", "status"])
  );

  account.hospitalId = req.body.hid;
  account.createdAt = new Date().toISOString();
  account.updatedAt = new Date().toISOString();
  account = await account.save();

  res.status(200).json({ message: "Account added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let account: any = await Accounts.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!account) return res.status(400).json({ message: "No record found." });

  let accountExist: any = await Accounts.findOne({
    $ne: { _id: req.body.id },
    name: req.body.name,
    hospitalId: req.body.hid,
  });
  if (accountExist)
    return res.status(400).json({ message: "Account already exist." });

  account = _.assign(
    account,
    _.pick(req.body, ["name", "type", "description", "status"])
  );

  account.hospitalId = req.body.hid;
  account.updatedAt = new Date().toISOString();
  account = await account.save();
  account = await accountView(account);

  res.status(200).json({ message: "Account updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let account = await Accounts.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!account) return res.status(400).json({ message: "No Data Found!" });

  await Accounts.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Account deleted successfully." });
};
