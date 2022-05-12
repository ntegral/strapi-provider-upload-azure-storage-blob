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
const identity_1 = require("@azure/identity");
const storage_blob_1 = require("@azure/storage-blob");
const trimParam = (str) => typeof str === "string" ? str.trim() : undefined;
function streamToBuffer(readableStream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on("end", () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on("error", reject);
        });
    });
}
const createClient = (config) => {
    const account = trimParam(config.account);
    const accountKey = trimParam(config.accountKey);
    const connStr = trimParam(config.connectionString);
    const tenant = trimParam(config.tenant);
    const client = trimParam(config.client);
    const secret = trimParam(config.secret);
    const sasToken = trimParam(config.sasToken);
    const serviceBaseURL = trimParam(config.serviceBaseURL) ||
        `https://${account}.blob.core.windows.net`;
    if (tenant && client && secret && account) {
        const defaultCredential = new identity_1.DefaultAzureCredential();
        return new storage_blob_1.BlobServiceClient(serviceBaseURL, defaultCredential);
    }
    else if (sasToken) {
        const anonymousCredential = new storage_blob_1.AnonymousCredential();
        return new storage_blob_1.BlobServiceClient(`${serviceBaseURL}${sasToken}`, anonymousCredential);
    }
    else if (connStr) {
        return storage_blob_1.BlobServiceClient.fromConnectionString(connStr);
    }
    else if (account && accountKey) {
        const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(account, accountKey);
        return new storage_blob_1.BlobServiceClient(serviceBaseURL, sharedKeyCredential);
    }
    else {
        throw new Error("Error in configuration, please be sure to configure the Azure account and accountKey or the connectionString.");
    }
};
module.exports = {
    provider: "azure-storage-blob",
    auth: {
        tenant: {
            label: "Azure Tenant Id",
            type: "text",
        },
        client: {
            label: "Azure Client Id",
            type: "text",
        },
        secret: {
            label: "Azure Client Secret",
            type: "text",
        },
        account: {
            label: "Account Name",
            type: "text",
        },
        accountKey: {
            label: "Secret Access Key",
            type: "text",
        },
        connectionString: {
            label: "Connection String",
            type: "text",
        },
        containerName: {
            label: "Container name",
            type: "text",
        },
        sasToken: {
            label: "SAS Token",
            type: "text",
        },
        defaultPath: {
            label: "The path to use when there is none being specified",
            type: "text",
        },
    },
    init: (config) => {
        const defaultPath = trimParam(config.defaultPath) || "assets";
        const containerName = trimParam(config.containerName);
        const client = createClient(config);
        return {
            uploadStream(file, customParams = {}) {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const containerClient = client.getContainerClient(containerName);
                        const blobClient = containerClient.getBlockBlobClient(`${defaultPath}/${file.name}`);
                        const options = {
                            blobHTTPHeaders: Object.assign({ blobContentType: file.mime }, customParams),
                        };
                        const bufferedStream = yield streamToBuffer(file.stream);
                        yield blobClient.uploadData(bufferedStream, options);
                        file.url = blobClient.url;
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            },
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const containerClient = client.getContainerClient(containerName);
                        const blobClient = containerClient.getBlockBlobClient(`${defaultPath}/${file.name}`);
                        const options = {
                            blobHTTPHeaders: Object.assign({ blobContentType: file.mime }, customParams),
                        };
                        yield blobClient.uploadData(file, options);
                        file.url = blobClient.url;
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            },
            delete(file, customParams = {}) {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const containerClient = client.getContainerClient(containerName);
                        const blobClient = containerClient.getBlobClient(`${defaultPath}/${file.name}`);
                        yield blobClient.delete();
                        file.url = blobClient.url;
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    }
                }));
            },
        };
    },
};
