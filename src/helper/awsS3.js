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
exports.deleteFile = exports.uploadFile = void 0;
const config_1 = __importDefault(require("config"));
// import AWS from "aws-sdk";
const client_s3_1 = require("@aws-sdk/client-s3");
const fs = __importStar(require("fs"));
// let awsKey: any = config.get('awsS3Bucket.awsKey');
// let awsSecret: any = config.get('awsS3Bucket.awsSecret');
const client = new client_s3_1.S3Client({
    region: config_1.default.get('awsS3Bucket.region'),
    credentials: {
        accessKeyId: config_1.default.get('awsS3Bucket.awsKey'),
        secretAccessKey: config_1.default.get('awsS3Bucket.awsSecret')
    }
});
// let s3: any = new AWS.S3({ apiVersion: '2006-03-01' });
const region = config_1.default.get('awsS3Bucket.region');
let bucket = config_1.default.get('awsS3Bucket.bucket');
const uploadFile = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: body.filename,
            Body: fs.readFileSync(body.file.path),
        });
        yield client.send(command);
        const url = `https://${bucket}.s3.${region}.amazonaws.com/${body.filename}`;
        return {
            success: true,
            url: url,
        };
    }
    catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            error: error.message,
        };
    }
});
exports.uploadFile = uploadFile;
const deleteFile = (path_1, ...args_1) => __awaiter(void 0, [path_1, ...args_1], void 0, function* (path, folder = '') {
    // let filename = path.split("/").pop();
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: bucket,
        Key: path
    });
    console.log(command);
    // return client.send(command, (error: any, data: any) => {
    //     if (error) {
    //         return false;
    //     }
    //     if (data) {
    //         console.log(data);
    //         return true;
    //     }
    // });
    try {
        const response = yield client.send(command);
        return response.$metadata.httpStatusCode === 204;
    }
    catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
});
exports.deleteFile = deleteFile;
