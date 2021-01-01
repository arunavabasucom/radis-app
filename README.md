# RADIS UI

[![Actions Status](https://github.com/suzil/radis-ui/workflows/GH/badge.svg)](https://github.com/suzil/radis-ui/actions)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](https://github.com/pre-commit/pre-commit)

⚠️ **WARNING: This project is still a work-in-progress. Any feedback on the project is highly appreciated.** ⚠️

**RADIS UI** is a locally-run web app for high-resolution infrared molecular spectra using [RADIS](https://github.com/radis/radis). The goal of this project is to provide an easy-to-use UI instead of writing code.


![image](https://user-images.githubusercontent.com/16088743/103406077-b2457100-4b59-11eb-82c0-e4de027a91c4.png)


## Usage

TODO: Create a Docker container to make it easy to run locally.


## Development

Install and start the backend.

```sh
$ python3 -m venv .env && source .env/bin/activate
$ pip install -r requirements/prod.txt
$ make backend
```

Install and start the frontend.

```sh
$ cd frontend/
$ yarn install
$ yarn start
```
