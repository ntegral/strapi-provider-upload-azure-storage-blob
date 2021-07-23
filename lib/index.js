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
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
const trimParam = (str) => (typeof str === 'string' ? str.trim() : undefined);
module.exports = {
    provider: 'azure-storage-blob',
    auth: {
        account: {
            lable: 'Account Name',
            type: 'text',
        },
        accountKey: {
            label: 'Secret Access Key',
            type: 'text',
        },
        containerName: {
            label: 'Container name',
            type: 'text',
        },
    },
    init: (config) => {
        const account = trimParam(config.account);
        const accountKey = trimParam(config.accountKey);
        const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(account, accountKey);
        const serviceBaseURL = trimParam(config.serviceBaseURL) || `https://${account}.blob.core.windows.net`;
        const client = new storage_blob_1.BlobServiceClient(serviceBaseURL, sharedKeyCredential);
        const containerName = trimParam(config.containerName);
        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const containerClient = client.getContainerClient(containerName);
                    const blobClient = containerClient.getBlockBlobClient(file.name);
                    const options = { blobHTTPHeaders: Object.assign({ blobContentType: file.type }, customParams) };
                    const result = yield blobClient.uploadData(file, options);
                    console.log('uploade:result', result);
                    resolve();
                }));
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    const containerClient = client.getContainerClient(containerName);
                    const blobClient = containerClient.getBlockBlobClient(file.name);
                    const result = yield blobClient.delete();
                    console.log('delete:result', result);
                    resolve();
                }));
            }
        };
    }
};
