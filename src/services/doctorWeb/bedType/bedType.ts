import { Request, Response } from "express";
import { BedType } from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  const bedType = await BedType.find({
    hospitalId: req.body.hospitalId,
  })
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: bedType });
};
