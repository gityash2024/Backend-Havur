"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailHandler = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = __importDefault(require("config"));
mail_1.default.setApiKey(config_1.default.get("sendgrid_api_key"));
const mailHandler = (emailAddress, verificationCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield mail_1.default.send({
            to: emailAddress,
            from: config_1.default.get("sendgrid_from_email"),
            subject: "Please verify that its you",
            text: `Please verify that it's you \n\n
            If you are attempting to sign-up, please use the following code to confirm your identity: \n\n
            ${verificationCode} \n\n
            Yours securely, \n\n
            Team Havur`,
            html: `Please verify that it's you<br/><br/>
            If you are attempting to sign-up, please use the following code to confirm your identity:<br/><br/>
            <b>${verificationCode}</b><br/><br/>
            Yours securely,<br/>
            Team Havur`,
        });
        if (!!response) {
            return true;
        }
    }
    catch (error) {
        return false;
    }
});
exports.mailHandler = mailHandler;
