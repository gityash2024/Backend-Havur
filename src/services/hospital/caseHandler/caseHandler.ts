import { Request, Response } from "express";
import { CaseHandler, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";
import { encrypt } from "../../../helper/encription";

const caseHandlerView = async (handler: any) => {
  handler = _.pick(handler, [
    "firstName",
    "lastName",
    "email",
    "designation",
    "phone",
    "gender",
    "qualification",
    "birthDate",
    "bloodGroup",
    "password",
    "profile",
    "address1",
    "address2",
    "city",
    "zip",
    "status",
  ]);
  return handler;
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let filter: any = new Object();
  if (req.body.status) {
    filter["status"] = req.body.status;
  }

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await CaseHandler.find({
      hospitalId: req.body.hid,
      $and: [filter],
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.caseHandler = await CaseHandler.find({
    hospitalId: req.body.hid,
    $and: [filter],
  })
    .select({
      status: 0,
      hospitalId: 0,
      password: 0,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let caseHandlerRecord: number = result.caseHandler.length;
  result.lastPage = caseHandlerRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let emailExist: any = await CaseHandler.findOne({
    email: req.body.email,
    hospitalId: req.body.hid,
  });
  if (emailExist)
    return res.status(400).json({ message: "Email already exist." });

  let phoneExist: any = await CaseHandler.findOne({
    phone: req.body.phone,
    hospitalId: req.body.hid,
  });
  if (phoneExist)
    return res.status(400).json({ message: "Phone already exist." });

  let caseHandler: any = new CaseHandler(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "designation",
      "phone",
      "gender",
      "qualification",
      "bloodGroup",
      "profile",
      "address1",
      "address2",
      "city",
      "zip",
      "status",
    ])
  );

  caseHandler.hospitalId = req.body.hid;
  caseHandler.password = await encrypt(req.body.password);
  caseHandler.birthDate = new Date(req.body.birthDate).toISOString();
  caseHandler.createdAt = new Date().toISOString();
  caseHandler.updatedAt = new Date().toISOString();
  caseHandler = await caseHandler.save();

  res.status(200).json({ message: "Case handler added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let caseHandler: any = await CaseHandler.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!caseHandler) return res.status(400).json({ message: "No case found." });
  if (caseHandler.email === req.body.email)
    return res.status(400).json({ message: "Email already exist." });
  if (caseHandler.phone === req.body.phone)
    return res.status(400).json({ message: "Phone already exist." });

  caseHandler = _.assign(
    caseHandler,
    _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "designation",
      "phone",
      "gender",
      "qualification",
      "bloodGroup",
      "profile",
      "address1",
      "address2",
      "city",
      "zip",
      "status",
    ])
  );

  caseHandler.birthDate = new Date(req.body.birthDate).toISOString();
  caseHandler.updatedAt = new Date().toISOString();
  caseHandler = await caseHandler.save();
  caseHandler = await caseHandlerView(caseHandler);

  res.status(200).json({ message: "Case handler updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let caseHandler = await CaseHandler.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!caseHandler) return res.status(400).json({ message: "No Data Found!" });

  await CaseHandler.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Case handler deleted successfully." });
};
