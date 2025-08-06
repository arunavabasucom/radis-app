from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import calculateSpectrum, fitSpectrum, downloadSpectrum, downloadTxt, root
import astropy.units as u
from astropy.units import cds
from src.helpers.logger_config import logger
import os

# for high resolution
# radis.config["GRIDPOINTS_PER_LINEWIDTH_WARN_THRESHOLD"] = 7

app = FastAPI(
    title="RADIS Application API",
    description="""
# RADIS Application API

A comprehensive web API for high-resolution infrared molecular spectra calculations using the RADIS library.

## Overview

The RADIS Application provides an intuitive interface for spectroscopic calculations, making it accessible to both researchers and non-researchers. This API supports:

- **Spectrum Calculation**: Compute molecular spectra using various databases (HITRAN, HITEMP, GEISA, ExoMol, NIST)
- **Spectrum Fitting**: Fit experimental spectra to theoretical models
- **Data Export**: Download spectra in various formats (.spec, .csv)
- **Non-equilibrium Calculations**: Support for non-equilibrium molecular states

## Key Features

- **Multiple Databases**: Support for HITRAN, HITEMP, GEISA, ExoMol, and NIST
- **Flexible Units**: Support for various wavelength, pressure, and path length units
- **Slit Function**: Optional slit function simulation for realistic spectra
- **File Upload**: Upload experimental data for spectrum fitting
- **Background Processing**: Efficient handling of large calculations

## Authentication

Currently, this API does not require authentication. All endpoints are publicly accessible.

## Rate Limiting

Please be mindful of server resources when making requests, especially for large spectral calculations.

## Support

For questions or issues, please visit our [GitHub repository](https://github.com/arunavabasu-03/radis-app) or create an issue.

## Citation

If you use this API in your research, please cite the RADIS library:

```
Erwin, P., et al. (2020). RADIS: A fast line-by-line code for rapid spectral synthesis. 
Journal of Quantitative Spectroscopy and Radiative Transfer, 261, 107476.
```
    """,
    version="1.0.0",
    contact={
        "name": "RADIS Application Team",
        "url": "https://github.com/arunavabasu-03/radis-app",
        # "email": "",
    },
    license_info={
        "name": "LGPL-3.0",
        "url": "https://github.com/arunavabasu-03/radis-app/blob/main/LICENSE",
    },
    openapi_tags=[
        {
            "name": "Spectrum Calculation",
            "description": "Endpoints for calculating molecular spectra using various databases and parameters.",
        },
        {
            "name": "Spectrum Fitting",
            "description": "Endpoints for fitting experimental spectra to theoretical models.",
        },
        {
            "name": "Data Export",
            "description": "Endpoints for downloading calculated spectra in various formats.",
        },
        {
            "name": "System",
            "description": "System information and health check endpoints.",
        },
    ],
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Development server",
        }
    ],
)

@app.on_event("startup")
async def clear_terminal():
    os.system("clear")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root.router, tags=["System"])
app.include_router(calculateSpectrum.router, tags=["Spectrum Calculation"])
app.include_router(fitSpectrum.router, tags=["Spectrum Fitting"])
app.include_router(downloadSpectrum.router, tags=["Data Export"])
app.include_router(downloadTxt.router, tags=["Data Export"])

logger.info("FastAPI app started with Logtail logging")
