# Strapi Provider Upload @azure/storage-blob
Strapi provider for image uploading to Azure using @azure/storage-blob.

[![NpmVersion](https://img.shields.io/npm/v/strapi-provider-upload-azure-storage-blob.svg)](https://www.npmjs.com/package/strapi-provider-upload-azure-storage-blob) [![NpmDownloads](https://img.shields.io/npm/dt/strapi-provider-upload-azure-storage-blob.svg)](https://www.npmjs.com/package/strapi-provider-upload-azure-storage-blob)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Node 14+
* npm 6+
* strapi@4

### Installing

Inside your strapi project run the following

```sh
yarn add @ntegral/strapi-provider-upload-azure-storage-blob

# or

npm install @ntegral/strapi-provider-upload-azure-storage-blob --save
```

## Usage

### Strapi version >= 4.0.0

With a stable release of Strapi 4.0.0, the configuration was moved to a JavaScript file. Official documentation [here](https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#using-a-provider).

To enable the provider, create or edit the file at ```./config/plugins.js```.

This is an example plugins.js file for Azure storage:
```JavaScript
/* AZURE IDENTITY */
module.exports = ({ env }) => ({
  upload: {
    provider: '@ntegral/strapi-provider-upload-azure-storage-blob',
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
    provider: '@ntegral/strapi-provider-upload-azure-storage-blob',
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
    provider: '@ntegral/strapi-provider-upload-azure-storage-blob',
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
    provider: '@ntegral/strapi-provider-upload-azure-storage-blob',
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

To enable the security for the provider, create or edit the file at ```./config/middleware.js```.
```Javascript
module.exports = ({ env }) => [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', `https://${env('STORAGE_ACCOUNT')}.blob.core.windows.net`],
          'media-src': ["'self'", 'data:', 'blob:', `https://${env('STORAGE_ACCOUNT')}.blob.core.windows.net`],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
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