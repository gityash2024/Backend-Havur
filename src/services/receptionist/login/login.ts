import { Request, Response } from "express";
import {
  Users,
  validateLogin,
  validateVerify,
  validateEmail,
  validateResetPassword,
} from "./_validation";
import _ from "lodash";
import { decrypt, encrypt } from "../../../helper/encription";

export const verifyOtp = async (req: Request, res: Response) => {
  const { error } = validateVerify(req.body);
  if (error) throw error;

  let user: any = await Users.findOne({
    email: req.body.email,
    otp: req.body.otp,
  });
  if (!user)
    return res.status(400).json({ message: "Verification Code not matched." });

  user.verificationCode = "";
  // user.status = "success";

  user.updatedAt = new Date().toISOString();
  user = await user.save();

  res.status(200).json({ message: "User verified successfully." });
};

export const sendOtp = async (req: Request, res: Response) => {
  const { error } = validateEmail(req.body);
  if (error) throw error;

  let user: any = await Users.findOne({
    email: req.body.email,
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid email! Please try again." });

  user.otp = 523322;
  user.updatedAt = new Date().toISOString();
  user = await user.save();

  res.status(200).json({ message: "OTP sent successfully." });
};

export const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) throw error;
  let user: any = await Users.findOne({
    email: req.body.email,
  });
  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });
  let password: string = await decrypt(user.password);
  if (req.body.password != password)
    return res
      .status(400)
      .json({ message: "Invalid Email or password! Please try again." });

  const token: any = await user.getAccessToken();
  res
    .status(200)
    .setHeader("x-auth-token", token)
    .json({ message: "Receptionist login successfully." });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { error } = validateEmail(req.body);
  if (error) throw error;

  let user: any = await Users.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid emailAddress! Please try again." });

  user.otp = 523322;

  user.updatedAt = new Date().toISOString();
  user = await user.save();

  res
    .status(200)
    .json({ message: "Reset Password Link sent on registered email address." });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { error } = validateResetPassword(req.body);
  if (error) throw error;

  let users: any = await Users.findOne({ email: req.body.email });
  if (!users) return res.status(400).json({ message: "Email not found.." });

  users.otp = null;
  users.password = await encrypt(req.body.password);

  users.updatedAt = new Date().toISOString();
  users = await users.save();

  res.status(200).json({ message: "Passsword updated successfully." });
};
