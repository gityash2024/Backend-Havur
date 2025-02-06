import { Request, Response } from "express";
import {
  Patient,
  validateEmail,
  validateLogin,
  validateLoginWithMobile,
  validateResetPassword,
  validateSignup,
  validateVerify,
} from "./_validation";
import { decrypt, encrypt } from "../../../helper/encription";
// import Crypto from 'crypto';
import _ from "lodash";
import { validateMobile } from "../../doctor/login/_validation";

export const signup = async (req: Request, res: Response) => {
  const { error } = validateSignup(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    emailAddress: req.body.emailAddress,
  });
  if (patients)
    return res
      .status(400)
      .json({ error: { emailAddress: "Email Address is already exist." } });

  let payload: any = _.pick(req.body, [
    "firstName",
    "lastName",
    "emailAddress",
    "mobileNumber",
    "gender",
  ]);
  payload.birthDate = new Date(req.body.birthDate).toISOString();
  payload.verificationCode = 523322;
  payload.password = await encrypt(req.body.password);

  let newPatient: any = new Patient(payload);
  newPatient.createdAt = new Date().toISOString();
  newPatient.updatedAt = new Date().toISOString();

  let existingPatient: any = await Patient.findOne({
    emailAddress: req.body.emailAddress,
    status: "pending",
  });
  if (existingPatient) {
    existingPatient.verificationCode = newPatient.verificationCode;
    existingPatient.updatedAt = new Date().toISOString();
    existingPatient = await existingPatient.save();
  } else {
    newPatient = await newPatient.save();
  }

  // const { mailHandler } = await import("../../../helper/mail");
  // await mailHandler(newUser.emailAddress, newUser.verificationCode);

  res.status(200).json({ message: "OTP sent successfully." });
};

export const verify = async (req: Request, res: Response) => {
  const { error } = validateVerify(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    emailAddress: req.body.emailAddress,
    verificationCode: req.body.verificationCode,
  });
  if (!patients)
    return res.status(400).json({ message: "Verification Code not matched." });

  patients.verificationCode = "";
  patients.status = "success";

  patients.updatedAt = new Date().toISOString();
  patients = await patients.save();

  res.status(200).json({ message: "Patient verified successfully." });
};

export const loginWithEmail = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    $or: [
      { name: req.body.emailAddress },
      { emailAddress: req.body.emailAddress },
    ],
  });
  if (!patients)
    return res
      .status(400)
      .json({ message: "Invalid emailAddress or password! Please try again." });
  if (patients.status === "pending")
    return res.status(400).json({ message: "Email Address not verified." });
  if (patients.status === "block")
    return res.status(400).json({
      message: "Your account has been blocked! Please contact admin.",
    });
  let password: string = await decrypt(patients.password);
  if (req.body.password != password)
    return res
      .status(400)
      .json({ message: "Invalid email or password! Please try again." });

  const token: any = await patients.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Patient login successfully." });
};

export const loginWithMobile = async (req: Request, res: Response) => {
  const { error } = validateLoginWithMobile(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (!patients)
    return res
      .status(400)
      .json({ message: "Invalid mobile number or otp! Please try again." });

  if (req.body.verificationCode != patients.verificationCode)
    return res
      .status(400)
      .json({ message: "Invalid mobile number or otp! Please try again." });

  const token: any = await patients.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Patient login successfully." });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { error } = validateEmail(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    emailAddress: req.body.emailAddress,
  });
  if (!patients)
    return res
      .status(400)
      .json({ message: "Invalid emailAddress! Please try again." });

  patients.verificationCode = 523322;

  patients.updatedAt = new Date().toISOString();
  patients = await patients.save();

  res
    .status(200)
    .json({ message: "Reset Password Link sent on registered email address." });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { error } = validateResetPassword(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    emailAddress: req.body.emailAddress,
  });
  if (!patients)
    return res.status(400).json({ message: "EmailAddress not found.." });

  patients.verificationCode = null;
  patients.password = await encrypt(req.body.password);

  patients.updatedAt = new Date().toISOString();
  patients = await patients.save();

  res.status(200).json({ message: "Passsword updated successfully." });
};

export const sendOtp = async (req: Request, res: Response) => {
  const { error } = validateEmail(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    emailAddress: req.body.emailAddress,
  });
  if (!patients)
    return res
      .status(400)
      .json({ message: "Invalid Email Address! Please try again." });

  patients.verificationCode = 523322;
  patients.updatedAt = new Date().toISOString();
  patients = await patients.save();

  res.status(200).json({ message: "OTP sent successfully." });
};

export const sendOtpMobile = async (req: Request, res: Response) => {
  const { error } = validateMobile(req.body);
  if (error) throw error;

  let patients: any = await Patient.findOne({
    mobileNumber: req.body.mobileNumber,
  });
  if (!patients)
    return res
      .status(400)
      .json({ message: "Invalid Mobile Number! Please try again." });

  patients.verificationCode = 523322;
  patients.updatedAt = new Date().toISOString();
  patients = await patients.save();

  res.status(200).json({ message: "OTP sent successfully." });
};
