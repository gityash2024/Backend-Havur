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
exports.userAuth = exports.adminAuth = exports.hospitalAuth = exports.doctorAuth = exports.patientAuth = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const encription_1 = require("../helper/encription");
const _validation_1 = require("../services/users/login/_validation");
const _validation_2 = require("../services/doctor/login/_validation");
const _validation_3 = require("../services/admin/login/_validation");
const _validation_4 = require("../services/hospital/login/_validation");
const _validation_5 = require("../services/receptionist/login/_validation");
const patientAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["x-auth-token"];
        if (!token)
            return res.status(401).json({ message: "Authentication failed!" });
        token = yield (0, encription_1.decrypt)(token);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        let _id = decodedToken.pid ? decodedToken.pid : null;
        let patient = yield _validation_1.Patient.findOne({ _id: _id });
        if (!patient)
            return res.status(401).json({ message: "Authentication failed!" });
        req.body.pid = _id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
});
exports.patientAuth = patientAuth;
const doctorAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["x-auth-token"];
        if (!token)
            return res.status(401).json({ message: "Authentication failed!" });
        token = yield (0, encription_1.decrypt)(token);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        let _id = decodedToken.did ? decodedToken.did : null;
        let doctor = yield _validation_2.Doctor.findOne({ _id: _id });
        if (!doctor)
            return res.status(401).json({ message: "Authentication failed!" });
        req.body.did = _id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
});
exports.doctorAuth = doctorAuth;
const hospitalAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["x-auth-token"];
        if (!token)
            return res.status(401).json({ message: "Authentication failed!" });
        token = yield (0, encription_1.decrypt)(token);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        let _id = decodedToken.hid ? decodedToken.hid : null;
        let hospital = yield _validation_4.Hospital.findOne({ _id: _id });
        if (!hospital)
            return res.status(401).json({ message: "Authentication failed!" });
        req.body.hid = _id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
});
exports.hospitalAuth = hospitalAuth;
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["x-auth-token"];
        if (!token)
            return res.status(401).json({ message: "Authentication failed!" });
        token = yield (0, encription_1.decrypt)(token);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        let _id = decodedToken.aid ? decodedToken.aid : null;
        let admin = yield _validation_3.Admin.findOne({ _id: _id });
        if (!admin)
            return res.status(401).json({ message: "Authentication failed!" });
        req.body.aid = _id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
});
exports.adminAuth = adminAuth;
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["x-auth-token"];
        if (!token)
            return res.status(401).json({ message: "Authentication failed!" });
        token = yield (0, encription_1.decrypt)(token);
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        let _id = decodedToken.uid ? decodedToken.uid : null;
        let user = yield _validation_5.Users.findOne({ _id: _id });
        if (!user)
            return res.status(401).json({ message: "Authentication failed!" });
        req.body.uid = _id;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
});
exports.userAuth = userAuth;
