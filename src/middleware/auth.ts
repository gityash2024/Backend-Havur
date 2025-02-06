import config from "config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decrypt } from "../helper/encription";
import { Patient } from "../services/users/login/_validation";
import { Doctor } from "../services/doctor/login/_validation";
import { Admin } from "../services/admin/login/_validation";
import { Hospital } from "../services/hospital/login/_validation";
import { Users } from "../services/receptionist/login/_validation";

export const patientAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers["x-auth-token"] as string;
    if (!token)
      return res.status(401).json({ message: "Authentication failed!" });

    token = await decrypt(token);

    const decodedToken: any = jwt.verify(token, config.get("jwtPrivateKey"));

    let _id: string = decodedToken.pid ? decodedToken.pid : null;
    let patient: any = await Patient.findOne({ _id: _id });
    if (!patient)
      return res.status(401).json({ message: "Authentication failed!" });
    req.body.pid = _id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};

export const doctorAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers["x-auth-token"] as string;
    if (!token)
      return res.status(401).json({ message: "Authentication failed!" });

    token = await decrypt(token);

    const decodedToken: any = jwt.verify(token, config.get("jwtPrivateKey"));

    let _id: string = decodedToken.did ? decodedToken.did : null;
    let doctor: any = await Doctor.findOne({ _id: _id });
    if (!doctor)
      return res.status(401).json({ message: "Authentication failed!" });
    req.body.did = _id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};

export const hospitalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers["x-auth-token"] as string;
    if (!token)
      return res.status(401).json({ message: "Authentication failed!" });

    token = await decrypt(token);

    const decodedToken: any = jwt.verify(token, config.get("jwtPrivateKey"));

    let _id: string = decodedToken.hid ? decodedToken.hid : null;
    let hospital: any = await Hospital.findOne({ _id: _id });
    if (!hospital)
      return res.status(401).json({ message: "Authentication failed!" });
    req.body.hid = _id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers["x-auth-token"] as string;
    if (!token)
      return res.status(401).json({ message: "Authentication failed!" });

    token = await decrypt(token);

    const decodedToken: any = jwt.verify(token, config.get("jwtPrivateKey"));

    let _id: string = decodedToken.aid ? decodedToken.aid : null;
    let admin: any = await Admin.findOne({ _id: _id });
    if (!admin)
      return res.status(401).json({ message: "Authentication failed!" });
    req.body.aid = _id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers["x-auth-token"] as string;
    if (!token)
      return res.status(401).json({ message: "Authentication failed!" });

    token = await decrypt(token);

    const decodedToken: any = jwt.verify(token, config.get("jwtPrivateKey"));

    let _id: string = decodedToken.uid ? decodedToken.uid : null;
    let user: any = await Users.findOne({ _id: _id });
    if (!user)
      return res.status(401).json({ message: "Authentication failed!" });
    req.body.uid = _id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};
