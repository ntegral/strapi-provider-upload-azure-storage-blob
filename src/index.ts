import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';
type StorageBlobConfig = {
    account: string,
    accountKey: string,
    containerName: string,
    serviceBaseURL?: string,
    defaultPath?: string
};

type StrapiFile = File & {
    path: string;
    url: string;
    hash: string;
    ext: string;
    buffer: string;
    mime: string;
}

const trimParam = (str:any) => (typeof str === 'string' ? str.trim() : undefined);

// A helper method used to read a Node.js readable stream into a Buffer
async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        readableStream.on("data", (data: Buffer | string) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
    });
}

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
        defaultPath: {
            label: 'The path to use when there is none being specified',
            type: 'text',
        },
    },

    init: (config:StorageBlobConfig) => {
        const account = <string>trimParam(config.account);
        const accountKey = <string>trimParam(config.accountKey);
        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const serviceBaseURL = trimParam(config.serviceBaseURL) || `https://${account}.blob.core.windows.net`
        const defaultPath = trimParam(config.defaultPath) || 'assets';
        

        const client = new BlobServiceClient(serviceBaseURL, sharedKeyCredential);
        const containerName = <string>trimParam(config.containerName);

        return {
            upload(file:StrapiFile, customParams = {}){
                return new Promise<void>(async(resolve,reject) => {
                    const containerClient = client.getContainerClient(containerName);

                    // create blobClient for container
                    const blobClient = containerClient.getBlockBlobClient(`${defaultPath}/${file.name}`);

                    // set mimetype as determined from browser with file upload control
                    const options = { blobHTTPHeaders: { blobContentType: file.type, ...customParams, } };

                    // upload file
                    const result = await blobClient.uploadData(file,options);
                    
                    file.url = blobClient.url;
                    resolve();
                })

            },
            delete(file:StrapiFile, customParams = {}){
                return new Promise<void>(async(resolve,reject) => {
                    const containerClient = client.getContainerClient(containerName);

                    // create blobClient for container
                    const blobClient = containerClient.getBlobClient(`${defaultPath}/${file.name}`);

                    await blobClient.delete();
                    file.url = blobClient.url;
                    resolve();
                })
            }
        }

    }
}