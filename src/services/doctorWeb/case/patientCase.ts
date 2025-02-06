import { Request, Response } from "express";
import { PatientCase } from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  const patientCase = await PatientCase.find({
    patientId: req.body.patientId,
  })
    .select({
      status: 0,
      hospitalId: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: patientCase });
};
