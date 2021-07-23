import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';
type StorageBlobConfig = {
    account: string,
    accountKey: string,
    containerName: string,
    serviceBaseURL?: string
};

const trimParam = (str:any) => (typeof str === 'string' ? str.trim() : undefined);

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

    init: (config:StorageBlobConfig) => {
        const account = <string>trimParam(config.account);
        const accountKey = <string>trimParam(config.accountKey);
        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const serviceBaseURL = trimParam(config.serviceBaseURL) || `https://${account}.blob.core.windows.net`
        

        const client = new BlobServiceClient(serviceBaseURL, sharedKeyCredential);
        const containerName = <string>trimParam(config.containerName);

        return {
            upload(file:File, customParams = {}){
                return new Promise<void>(async(resolve,reject) => {
                    const containerClient = client.getContainerClient(containerName);

                    // create blobClient for container
                    const blobClient = containerClient.getBlockBlobClient(file.name);

                    // set mimetype as determined from browser with file upload control
                    const options = { blobHTTPHeaders: { blobContentType: file.type, ...customParams, } };

                    // upload file
                    const result = await blobClient.uploadData(file,options);
                    console.log('uploade:result', result);
                    resolve();
                })

            },
            delete(file:File, customParams = {}){
                return new Promise<void>(async(resolve,reject) => {
                    const containerClient = client.getContainerClient(containerName);

                    // create blobClient for container
                    const blobClient = containerClient.getBlockBlobClient(file.name);

                    const result = await blobClient.delete();
                    console.log('delete:result', result);
                    resolve();
                })
            }
        }

    }
}