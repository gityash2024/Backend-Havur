import { Request, Response } from "express";
import { Bed, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";
import generateAutoID from "../../../helper/autoGenerate";

const bedView = async (bed: any) => {
  bed = _.pick(bed, [
    "name",
    "hospitalId",
    "bedType",
    "description",
    "charge",
    "available",
    "status",
  ]);
  return bed;
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await Bed.find({
      hospitalId: req.body.hid,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.bed = await Bed.find({
    hospitalId: req.body.hid,
    status: true,
  })
    .populate("bedType", { bedType: 1 })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let bedRecord: number = result.bed.length;
  result.lastPage = bedRecord <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let nameExist: any = await Bed.findOne({
    name: req.body.name,
    bedType: req.body.bedType,
    hospitalId: req.body.hid,
  });
  if (nameExist)
    return res.status(400).json({ message: "Name already exist." });

  let bed: any = new Bed(
    _.pick(req.body, ["name", "bedType", "description", "charge", "status"])
  );

  bed.bedId = generateAutoID(8);
  bed.available = "no";
  bed.hospitalId = req.body.hid;
  bed.createdAt = new Date().toISOString();
  bed.updatedAt = new Date().toISOString();
  bed = await bed.save();

  res.status(200).json({ message: "Bed added successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let bed: any = await Bed.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bed) return res.status(400).json({ message: "No bed type found." });
  if (bed.name === req.body.name)
    return res.status(400).json({ message: "Name already exist." });

  bed = _.assign(
    bed,
    _.pick(req.body, ["name", "bedType", "description", "charge", "status"])
  );

  bed.hospitalId = req.body.hid;
  bed.updatedAt = new Date().toISOString();
  bed = await bed.save();
  bed = await bedView(bed);

  res.status(200).json({ message: "Bed updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let bed = await Bed.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bed) return res.status(400).json({ message: "No Data Found!" });

  await Bed.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Bed deleted successfully." });
};

export const bedTypelist = async (req: Request, res: Response) => {
  const bed = await Bed.find({
    bedType: req.body.bedType,
    hospitalId: req.body.hid,
  })
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: bed });
};
