import { Request, Response } from "express";
import { Admin, validateLogin, validateSignup, validateEmail,validateResetPassword } from "./_validation";
import _ from "lodash";
import { decrypt,encrypt } from "../../../helper/encription";

export const signup = async (req: Request, res: Response) => {
    const { error } = validateSignup(req.body);
    if (error) throw error;

    let adminEmail: any = await Admin.findOne({ emailAddress: req.body.emailAddress});
        if (adminEmail) return res.status(400).json({ error: { emailAddress: 'Email Address is already exist!.' } });
    let adminUsername: any = await Admin.findOne({ userName: req.body.userName});
        if (adminUsername) return res.status(400).json({ error: { userName: 'User Name is already exist!.' } });

        let payload: any = _.pick(req.body, [
            "userName","emailAddress"
        ]);
        payload.password = await encrypt(req.body.password);

        let newAdmin: any = new Admin(payload);
        newAdmin.createdAt = new Date().toISOString();
        newAdmin.updatedAt = new Date().toISOString();

        newAdmin = await newAdmin.save();

        res.status(200).json({ message: "Sign up Successfully..." });
}


export const login = async (req: Request, res: Response) => {
    const { error } = validateLogin(req.body);
    if (error) throw error;

    let admins: any = await Admin.findOne({ $or: [{userName: req.body.userName},{ emailAddress : req.body.userName }]});
        if (!admins) return res.status(400).json({ message: 'No User Found' });
        let password: string = await decrypt(admins.password);
        if (req.body.password != password) return res.status(400).json({ message: "Invalid email or password! Please try again." });

        const token: any = await admins.getAccessToken();
        res.status(200).setHeader("x-auth-token", token).json({ message: "Admin login successfully." });
}

export const forgotPassword = async (req: Request, res: Response) => {
    const { error } = validateEmail(req.body);
    if (error) throw error;

    let admin: any = await Admin.findOne({ emailAddress: req.body.emailAddress });
    if (!admin) return res.status(400).json({ message: 'Invalid emailAddress! Please try again.' });

    admin.verificationCode = 523322;

    admin.updatedAt = new Date().toISOString();
    admin = await admin.save();

    res.status(200).json({ message: "Reset Password Link sent on registered email address." });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { error } = validateResetPassword(req.body);
    if (error) throw error;

    let admin: any = await Admin.findOne({ emailAddress: req.body.emailAddress });
    if (!admin) return res.status(400).json({ message: 'EmailAddress not found..' });

    admin.verificationCode = null;
    admin.password = await encrypt(req.body.password);

    admin.updatedAt = new Date().toISOString();
    admin = await admin.save();

    res.status(200).json({ message: "Passsword updated successfully." });
};
