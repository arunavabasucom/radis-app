
   [![Production deployment](https://github.com/suzil/radis-app/actions/workflows/cd.yml/badge.svg)](https://github.com/suzil/radis-app/actions/workflows/cd.yml)

**RADIS app** is a web application for [Radis](https://github.com/radis/radis)  high-resolution infrared molecular spectra. Instead of writing code, this project aims to create an intuitive user interface (UI).

It use radis internally to produce spectrum, and the updated version and radis algorithm make it incredibly efficient to compute the millions of lines in only a few minutes.

Radis app leverages **React 18** to offer the user interface, and **FastApi** on the backend. We are using **react-hook-form** for the fastest user experience and to maintain performance on the client slide. In the backend, we use **FastApi**  to offer the fastest response.


## ✅ **Installation**

### Locally

- **setup frontend**

```bash
cd frontend  # go to frontend directory
yarn install # install all dependencies
yarn start # to start local dev server
```

- **setup backend**

```bash
cd server
pip install -r requirements.txt # to install all packages
uvicorn main: app --reload # to run a local server
```

If you are getting a `library not found for -lhdf5` error on MacOS, you can try the following

If you haven't already, install [Homebrew](https://brew.sh/) for MacOS.
```bash
brew install hdf5 # install the possibly missing library
export HDF5_DIR=/opt/homebrew/opt/hdf5  # fix Homebrew directory bug
```
After this, you can re-run `pip install -r requirements.txt`.

### Docker

We are also working to support installation using Docker.

## ✅ **Usage**

We created this app with the intention of giving both researchers and non-researchers access to the most valuable elements of Radis via a straightforward online application. Our team and contributors are always trying to make the app better. The app has additional features and capabilities in newer versions.

👉 some of main features :                

- Ploting spectra
<img width="1295" alt="plot" src="https://user-images.githubusercontent.com/73842340/188674106-84ca91d8-a290-4030-826b-5d31eebaeee1.png">

- Exporing spectra
<img width="1301" alt="download" src="https://user-images.githubusercontent.com/73842340/188674380-92be84f8-9d32-4a7a-bd26-4c507db5f384.png">

-  Overlay spectra
<img width="1301" alt="download" src="https://user-images.githubusercontent.com/73842340/188674505-c9107b78-79c3-4c76-825f-6c5651320ae5.png">
                 
## ✅ **License**

[LGPL-3.0 license](https://github.com/suzil/radis-app/blob/main/LICENSE)
