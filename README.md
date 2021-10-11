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

To change which API endpoint the app uses, adjust `website/static/js/config.js`:

```js
// Use production API endpoint
export const apiEndpoint =
  "https://0cfrg17v18.execute-api.us-east-2.amazonaws.com/prod/";
```
