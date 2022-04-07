# Strapi Provider Upload @azure/storage-blob
Strapi provider for image uploading to Azure using @azure/storage-blob.

[![NpmVersion](https://img.shields.io/npm/v/strapi-provider-upload-azure-storage-blob.svg)](https://www.npmjs.com/package/strapi-provider-upload-azure-storage-blob) [![NpmDownloads](https://img.shields.io/npm/dt/strapi-provider-upload-azure-storage-blob.svg)](https://www.npmjs.com/package/strapi-provider-upload-azure-storage-blob)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Node 10+
* npm 6+
* strapi@3.0.0-beta.16+

### Installing

Inside your strapi project run the following

```sh
yarn add strapi-provider-upload-azure-storage-blob

# or

npm install strapi-provider-upload-azure-storage-blob --save
```

## Usage

### Strapi version >= 4.0.0

To enable the provider, create or edit the file at ```./config/plugins.js```.

This is an example plugins.js file for Azure storage:
```JavaScript
/* AZURE IDENTITY */
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'azure-storage-blob',
      providerOptions: {
        account: env('STORAGE_ACCOUNT'),
        accountKey: env('STORAGE_ACCOUNT_KEY'),
        serviceBaseURL: env('STORAGE_URL'),
        containerName: env('STORAGE_CONTAINER_NAME'),
        defaultPath: 'assets',
      }
    }
  }
});
/* AZURE SAS TOKEN */
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'azure-storage-blob',
      providerOptions: {
        account: env('STORAGE_ACCOUNT'),
        serviceBaseURL: env('STORAGE_URL'),
        containerName: env('STORAGE_CONTAINER_NAME'),
        defaultPath: 'assets',
      }
    }
  }
});
/* AZURE CONNECTION STRING */
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'azure-storage-blob',
      providerOptions: {
        account: env('STORAGE_ACCOUNT'),
        serviceBaseURL: env('STORAGE_URL'),
        containerName: env('STORAGE_CONTAINER_NAME'),
        connectionString: env('STORAGE_CONNECTION_STRING'),
        defaultPath: 'assets',
      }
    }
  }
});
/* AZURE STORAGE CREDENTIAL */
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'azure-storage-blob',
      providerOptions: {
        account: env('STORAGE_ACCOUNT'),
        accountKey: env('STORAGE_ACCOUNT_KEY'),
        serviceBaseURL: env('STORAGE_URL'),
        containerName: env('STORAGE_CONTAINER_NAME'),
        defaultPath: 'assets',
      }
    }
  }
});
```

### Strapi version < 4.0.0 and >= 3.0.0

With a stable release of Strapi 3.0.0, the configuration was moved to a JavaScript file. Official documentation [here](https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#using-a-provider).

To enable the provider, create or edit the file at ```./config/plugins.js```.

This is an example plugins.js file for Azure storage:
```JavaScript
/* AZURE IDENTITY */
module.exports = ({ env }) => ({
  upload: {
    provider: 'azure-storage-blob',
    providerOptions: {
      account: env('STORAGE_ACCOUNT'),
      accountKey: env('STORAGE_ACCOUNT_KEY'),
      serviceBaseURL: env('STORAGE_URL'),
      containerName: env('STORAGE_CONTAINER_NAME'),
      defaultPath: 'assets',
    }
  }
});
/* AZURE SAS TOKEN */
module.exports = ({ env }) => ({
  upload: {
    provider: 'azure-storage-blob',
    providerOptions: {
      account: env('STORAGE_ACCOUNT'),
      serviceBaseURL: env('STORAGE_URL'),
      containerName: env('STORAGE_CONTAINER_NAME'),
      defaultPath: 'assets',
    }
  }
});
/* AZURE CONNECTION STRING */
module.exports = ({ env }) => ({
  upload: {
    provider: 'azure-storage-blob',
    providerOptions: {
      account: env('STORAGE_ACCOUNT'),
      serviceBaseURL: env('STORAGE_URL'),
      containerName: env('STORAGE_CONTAINER_NAME'),
      connectionString: env('STORAGE_CONNECTION_STRING'),
      defaultPath: 'assets',
    }
  }
});
/* AZURE STORAGE CREDENTIAL */
module.exports = ({ env }) => ({
  upload: {
    provider: 'azure-storage-blob',
    providerOptions: {
      account: env('STORAGE_ACCOUNT'),
      accountKey: env('STORAGE_ACCOUNT_KEY'),
      serviceBaseURL: env('STORAGE_URL'),
      containerName: env('STORAGE_CONTAINER_NAME'),
      defaultPath: 'assets',
    }
  }
});
```
Either supply the `account` and `accountKey` or the `connectionString`
`serviceBaseURL` is optional, it is useful when connecting to Azure Storage API compatible services, like the official emulator [Azurite](https://github.com/Azure/Azurite/). `serviceBaseURL` would then look like `http://localhost:10000/your-storage-account-key`.  
When `serviceBaseURL` is not provided, default `https://${account}.blob.core.windows.net` will be used.

## Contributing

Contributions are welcome

## Authors

* **Ntegral Inc** - *Initial work* - [Ntegral Inc.](https://github.com/ntegral)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [strapi.io](https://strapi.io)
- [Azure](https://azure.microsoft.com)