# radis-ui

radis-ui is a locally-run web app for high-resolution infrared molecular spectra using [RADIS](https://github.com/radis/radis). The goal of this project is to provide an easy-to-use UI instead of writing code.


## Usage

TODO: Create a Docker container to make it easy to run locally.


## Development

Install and start the backend.

```sh
$ python3 -m venv .env && source .env/bin/activate
$ pip install -r requirements.txt
$ make backend
```

Install and start the frontend.

```sh
$ cd frontend/
$ yarn install
$ yarn start
```
