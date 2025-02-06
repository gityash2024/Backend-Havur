"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.fileDelete = exports.fileUploadHospital = exports.fileUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const fs = __importStar(require("fs"));
const config_1 = __importDefault(require("config"));
const path_1 = __importDefault(require("path"));
const fileSizeLimit = 5 * 1024 * 1024;
const acceptedImageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "JPG",
    "JPEG",
    "PNG",
    "pdf",
    "PDF",
];
const upload = (0, multer_1.default)({
    limits: {
        fileSize: fileSizeLimit,
    },
    fileFilter: (req, file, cb) => {
        if (acceptedImageExtensions.some((ext) => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }
        return cb(new Error("Only " + acceptedImageExtensions.join(", ") + " files are allowed!"));
    },
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            let path = config_1.default.get("file.path");
            cb(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});
const fileUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadFile = upload.single("file");
    let pid = req.body.pid;
    yield uploadFile(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(req.body);
        if (req.body.pid) {
            pid = req.body.pid;
        }
        if (error) {
            return next(error);
        }
        if (!req.file)
            return res.status(400).json({ message: "No file found" });
        if (!req.body.fileType)
            return res.status(400).json({ message: "No file type selected" });
        let fileObject = {
            file: req.file,
            filename: pid + "/" + req.body.fileType + "/" + path_1.default.basename(req.file.path),
        };
        const { uploadFile } = yield Promise.resolve().then(() => __importStar(require("./awsS3")));
        let result = yield uploadFile(fileObject);
        if (result == null)
            return res.status(400).json({ message: "File uploading failed." });
        if (result != null) {
            fs.unlinkSync(req.file.path);
            req.body.filename = result;
            next();
        }
    }));
});
exports.fileUpload = fileUpload;
const fileUploadHospital = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadFile = upload.single("file");
    let aid = req.body.aid;
    yield uploadFile(req, res, (error) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(req.body);
        if (req.body.aid) {
            aid = req.body.aid;
        }
        if (error) {
            return next(error);
        }
        if (!req.file)
            return res.status(400).json({ message: "No file found" });
        if (!req.body.fileType)
            return res.status(400).json({ message: "No file type selected" });
        let fileObject = {
            file: req.file,
            filename: aid + "/" + req.body.fileType + "/" + path_1.default.basename(req.file.path),
        };
        const { uploadFile } = yield Promise.resolve().then(() => __importStar(require("./awsS3")));
        let result = yield uploadFile(fileObject);
        if (result == null)
            return res.status(400).json({ message: "File uploading failed." });
        if (result != null) {
            fs.unlinkSync(req.file.path);
            req.body.filename = result;
            next();
        }
    }));
});
exports.fileUploadHospital = fileUploadHospital;
const fileDelete = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    const { deleteFile } = yield Promise.resolve().then(() => __importStar(require("./awsS3")));
    return yield deleteFile(filename);
});
exports.fileDelete = fileDelete;
