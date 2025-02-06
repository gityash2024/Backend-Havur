import { Request, Response } from "express";
import { Hospitals, validateView, validateUpdate } from "./_validation";
import _ from "lodash";
// import { encrypt } from "../../../helper/encription";

const hospitalView = async (hospital: any) => {
  hospital = _.pick(hospital, [
    "name",
    "emailAddress",
    "mobileNumber",
    "description",
    "address",
    "location",
    "hours",
    "mrp",
    "discount",
    "total",
    "image",
    "logo",
    "type",
  ]);
  return hospital;
};

export const view = async (req: Request, res: Response) => {
  const { error } = validateView(req.body);
  if (error) throw error;
  let hospital: any = await Hospitals.findOne({ _id: req.body.hid });
  if (!hospital) return res.status(404).json({ message: "No record found." });

  res.status(200).json({
    data: { hospital: hospital },
  });
};

export const update = async (req: Request, res: Response) => {
  const { error } = validateUpdate(req.body);
  if (error) throw error;

  let hospitalMobile: any = await Hospitals.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (hospitalMobile)
    return res
      .status(400)
      .json({ error: { mobileNumber: "Mobile No. is already exists." } });

  let hospitalEmail: any = await Hospitals.findOne({
    emailAddress: req.body.emailAddress,
  });
  if (hospitalEmail)
    return res
      .status(400)
      .json({ error: { mobileNumber: "Email Id  is already exists." } });

  let hospital: any = await Hospitals.findOne({ _id: req.body.hid });
  if (!hospital) return res.status(404).json({ message: "No record found." });

  hospital = _.assign(
    hospital,
    _.pick(req.body, [
      "name",
      "emailAddress",
      "mobileNumber",
      "description",
      "address",
      "location",
      "hours",
      "mrp",
      "discount",
      "total",
      "image",
      "logo",
      "type",
    ])
  );
  hospital.updatedAt = new Date().toISOString();
  hospital = await hospital.save();
  hospital = await hospitalView(hospital);

  res.status(200).json({ message: "Hospital updated successfully." });
};
