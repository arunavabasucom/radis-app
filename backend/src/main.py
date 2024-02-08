from  fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import  calculateSpectrum ,downloadSpectrum,downloadTxt,root
# import astropy.units as u
# from astropy.units import cds




# for high resolution
# radis.config["GRIDPOINTS_PER_LINEWIDTH_WARN_THRESHOLD"] = 7

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(root.router)
app.include_router(calculateSpectrum.router)
app.include_router(downloadSpectrum.router)
app.include_router(downloadTxt.router)
