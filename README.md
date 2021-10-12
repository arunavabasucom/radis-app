# RADIS App

[![Actions Status](https://github.com/suzil/radis-app/workflows/GH/badge.svg)](https://github.com/suzil/radis-app/actions)

⚠️ **WARNING: This project is still a work-in-progress. Any feedback on the project is highly appreciated.** ⚠️

**RADIS app** is a web app for high-resolution infrared molecular spectra using [RADIS](https://github.com/radis/radis). The goal of this project is to provide an easy-to-use UI instead of writing code.

![image](https://user-images.githubusercontent.com/16088743/103406077-b2457100-4b59-11eb-82c0-e4de027a91c4.png)

## Development

Install all dependencies:

```sh
$ yarn install
```

Start the frontend locally:

```sh
$ cd website/ && yarn start
```

Deploy the backend to your AWS account:

```sh
$ yarn build && yarn cdk deploy
```

Alternatively, to run the backend locally, please follow the installation instructions [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk-getting-started.html) to install the `sam-beta-cdk` executable. Then run the following commands:

```sh
# For some reason we need to build first or else the image name will be invalid for Docker to invoke
$ sam-beta-cdk build RadisAppStack/CalculateSpectrumFunction
$ sam-beta-cdk local start-api
# Run in a new session, needed for CORS to work
$ npx lcp --proxyUrl http://127.0.0.1:3000/
```
