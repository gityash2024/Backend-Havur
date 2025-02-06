import { Request, Response } from "express";
import { Bed } from "./_validation";
import _ from "lodash";

export const list = async (req: Request, res: Response) => {
  const bed = await Bed.find({
    bedType: req.body.bedType,
    hospitalId: req.body.hospitalId,
  })
    .select({
      status: 0,
    })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ data: bed });
};
