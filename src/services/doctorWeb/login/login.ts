import { Request, Response } from "express";
import {
  Doctor,
  validateLogin,
  validateMobile,
  validateVerify,
  validateEmail,
  validateResetPassword,
} from "./_validation";
import _ from "lodash";
import { decrypt, encrypt } from "../../../helper/encription";

export const signup = async (req: Request, res: Response) => {
  const { error } = validateMobile(req.body);
  if (error) throw error;

  let doctor: any = await Doctor.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (doctor)
    return res
      .status(400)
      .json({ error: { mobileNumber: "Mobile Number is already exist!." } });

  let payload: any = _.pick(req.body, ["mobileNumber"]);
  payload.otp = 523322;

  let newDoctor: any = new Doctor(payload);
  newDoctor.createdAt = new Date().toISOString();
  newDoctor.updatedAt = new Date().toISOString();

  newDoctor = await newDoctor.save();

  res.status(200).json({ message: "OTP sent successfully." });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { error } = validateVerify(req.body);
  if (error) throw error;

  let doctor: any = await Doctor.findOne({
    mobileNumber: req.body.mobileNumber,
    otp: req.body.verificationCode,
  });
  if (!doctor)
    return res.status(400).json({ message: "Verification Code not matched." });

  doctor.verificationCode = "";
  // doctor.status = "success";

  doctor.updatedAt = new Date().toISOString();
  doctor = await doctor.save();

  const token: any = await doctor.getAccessToken();

  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Doctor verified successfully." });
};

export const sendOtp = async (req: Request, res: Response) => {
  const { error } = validateMobile(req.body);
  if (error) throw error;

  let doctor: any = await Doctor.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (!doctor)
    return res
      .status(400)
      .json({ message: "Invalid mobile number! Please try again." });

  doctor.verificationCode = 523322;
  doctor.updatedAt = new Date().toISOString();
  doctor = await doctor.save();

  res.status(200).json({ message: "OTP sent successfully." });
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) throw error;
  let doctors: any = await Doctor.findOne({
    $or: [{ mobileNumber: req.body.email }, { email: req.body.email }],
  });
  if (!doctors)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });
  let password: string = await decrypt(doctors.password);
  if (req.body.password != password)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });

  const token: any = await doctors.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Doctor login successfully." });
};
export const forgotPassword = async (req: Request, res: Response) => {
  const { error } = validateEmail(req.body);
  if (error) throw error;

  let doctor: any = await Doctor.findOne({ email: req.body.email });
  if (!doctor)
    return res
      .status(400)
      .json({ message: "Invalid emailAddress! Please try again." });

  doctor.verificationCode = 523322;

  doctor.updatedAt = new Date().toISOString();
  doctor = await doctor.save();

  res
    .status(200)
    .json({ message: "Reset Password Link sent on registered email address." });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { error } = validateResetPassword(req.body);
  if (error) throw error;

  let doctor: any = await Doctor.findOne({ email: req.body.email });
  if (!doctor)
    return res.status(400).json({ message: "EmailAddress not found.." });

  doctor.verificationCode = null;
  doctor.password = await encrypt(req.body.password);

  doctor.updatedAt = new Date().toISOString();
  doctor = await doctor.save();

  res.status(200).json({ message: "Passsword updated successfully." });
};
