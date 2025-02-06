import { Request, Response } from "express";
import { BedAssign, validateAdd, validateDelete } from "./_validation";
import _ from "lodash";

const bedAssignView = async (bed: any) => {
  bed = _.pick(bed, ["case", "ipdPatient", "bed", "date", "description"]);
  return bed;
};

export const list = async (req: Request, res: Response) => {
  let pageNo: number = req.body.pageNo ? req.body.pageNo : 1;
  let recordPerPage: number = 15;

  let skip: any = (pageNo - 1) * recordPerPage;
  let limit: any = recordPerPage;

  let result: any = {};
  if (pageNo === 1) {
    let totalRecords: number = await BedAssign.find({
      hospitalId: req.body.hid,
      status: true,
    }).countDocuments();
    result.totalRecords = totalRecords;
  }
  result.bedAssign = await BedAssign.find({
    hospitalId: req.body.hid,
    status: true,
  })
    .populate("case", { caseId: 1, caseDate: 1, patientId: 1 })
    .populate("ipdPatient", { ipdNo: 1, admissionDate: 1, patientId: 1 })
    .populate("bed", {
      bedId: 1,
      name: 1,
      available: 1,
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  let bedAssign: number = result.bedAssign.length;
  result.lastPage = bedAssign <= recordPerPage ? true : false;

  res.status(200).json({ data: result });
};

export const add = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let nameExist: any = await BedAssign.findOne({
    case: req.body.case,
    ipdPatient: req.body.ipdPatient,
    hospitalId: req.body.hid,
  });
  if (nameExist)
    return res.status(400).json({ message: "Bed already assign." });

  let bed: any = new BedAssign(
    _.pick(req.body, ["case", "ipdPatient", "bed", "description"])
  );

  bed.date = new Date(req.body.date).toISOString();
  bed.hospitalId = req.body.hid;
  bed.createdAt = new Date().toISOString();
  bed.updatedAt = new Date().toISOString();
  bed = await bed.save();

  res.status(200).json({ message: "Bed assign successfully." });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateAdd(req.body);
  if (error) throw error;

  let bed: any = await BedAssign.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bed) return res.status(400).json({ message: "No bed Assign found." });
  if (bed.case === req.body.case)
    return res.status(400).json({ message: "Assign already exist." });

  bed = _.assign(
    bed,
    _.pick(req.body, ["case", "ipdPatient", "bed", "description"])
  );

  bed.dischargeDate = new Date(req.body.dischargeDate).toISOString();
  bed.date = new Date(req.body.date).toISOString();
  bed.hospitalId = req.body.hid;
  bed.updatedAt = new Date().toISOString();
  bed = await bed.save();
  bed = await bedAssignView(bed);

  res.status(200).json({ message: "Bed Assign updated successfully." });
};

export const remove = async (req: Request, res: Response) => {
  const { error } = validateDelete(req.body);
  if (error) throw error;

  let bed = await BedAssign.findOne({
    _id: req.body.id,
    hospitalId: req.body.hid,
  });
  if (!bed) return res.status(400).json({ message: "No Data Found!" });

  await BedAssign.deleteOne({ _id: req.body.id, hospitalId: req.body.hid });

  res.status(200).json({ message: "Assign deleted successfully." });
};
