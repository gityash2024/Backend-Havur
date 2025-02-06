import { Request, Response } from "express";
import { BedType, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";

const bedTypeView = async (bedType: any) => {
  bedType = _.pick(bedType, ["hospitalId", "bedType", "description", "status"]);
  return bedType;
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await BedType.find({
      hospitalId: req.body.hid,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.bedType = await BedType.find({
    hospitalId: req.body.hid,
    status: true,
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let bedTypeRecord: number = result.bedType.length;
  result.lastPage = bedTypeRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let bedTypeExist: any = await BedType.findOne({
    bedType: req.body.bedType,
    hospitalId: req.body.hid,
  });
  if (bedTypeExist)
    return res.status(400).json({ message: "Bed type already exist." });

  let bedType: any = new BedType(_.pick(req.body, ["bedType", "description"]));

  bedType.hospitalId = req.body.hid;
  bedType.createdAt = new Date().toISOString();
  bedType.updatedAt = new Date().toISOString();
  bedType = await bedType.save();

  res.status(200).json({ message: "Bed type added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let bedType: any = await BedType.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bedType) return res.status(400).json({ message: "No bed type found." });
  if (bedType.bedType === req.body.bedType)
    return res.status(400).json({ message: "Bed type already exist." });

  bedType = _.assign(bedType, _.pick(req.body, ["bedType", "description"]));

  bedType.hospitalId = req.body.hid;
  bedType.updatedAt = new Date().toISOString();
  bedType = await bedType.save();
  bedType = await bedTypeView(bedType);

  res.status(200).json({ message: "Bed Type updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let bedType = await BedType.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bedType) return res.status(400).json({ message: "No Data Found!" });

  await BedType.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Bed Type deleted successfully." });
};
