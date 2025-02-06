import { Request, Response } from "express";
import { Hospital, validateLogin,validateEmail,validateResetPassword } from "./_validation";
import _ from "lodash";
import { decrypt,encrypt } from "../../../helper/encription";


export const login = async (req: Request, res: Response) => {
    const { error } = validateLogin(req.body);
    if (error) throw error;

    let hospital: any = await Hospital.findOne({ $or: [{name: req.body.name},{ emailAddress : req.body.name }]});
        if (!hospital) return res.status(400).json({ message: 'No User Found' });
        let password: string = await decrypt(hospital.password);
        
        if (req.body.password != password) return res.status(400).json({ message: "Invalid email or password! Please try again." });

        const token: any = await hospital.getAccessToken();
        res.status(200).setHeader("x-auth-token", token).json({ message: "Hospital login successfully." });
}
export const forgotPassword = async (req: Request, res: Response) => {
    const { error } = validateEmail(req.body);
    if (error) throw error;

    let hospital: any = await Hospital.findOne({ emailAddress: req.body.emailAddress });
    if (!hospital) return res.status(400).json({ message: 'Invalid emailAddress! Please try again.' });

    hospital.verificationCode = 523322;

    hospital.updatedAt = new Date().toISOString();
    hospital = await hospital.save();

    res.status(200).json({ message: "Reset Password Link sent on registered email address." });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { error } = validateResetPassword(req.body);
    if (error) throw error;

    let hospital: any = await Hospital.findOne({ emailAddress: req.body.emailAddress });
    if (!hospital) return res.status(400).json({ message: 'EmailAddress not found..' });

    hospital.verificationCode = null;
    hospital.password = await encrypt(req.body.password);

    hospital.updatedAt = new Date().toISOString();
    hospital = await hospital.save();

    res.status(200).json({ message: "Passsword updated successfully." });
};
export const sendOtp = async (req: Request, res: Response ) => {
    const { error } = validateEmail(req.body);
    if (error) throw error;

    let hospital: any = await Hospital.findOne({ emailAddress: req.body.emailAddress });
    if (!hospital) return res.status(400).json({ message: 'Invalid emailAddress! Please try again.' });

    hospital.verificationCode = 523322;
    hospital.updatedAt = new Date().toISOString();
    hospital = await hospital.save();
    
    res.status(200).json({ message: "OTP sent successfully." });
}