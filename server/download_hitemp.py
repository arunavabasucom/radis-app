# -*- coding: utf-8 -*-
"""
Download HITEMP database, parse & cache them, to make sure the example notebooks run fast 
"""

from radis.test.utils import setup_test_line_databases
from radis.io.hitemp import fetch_hitemp

setup_test_line_databases()  # init radis.json etc if needed

# Download other species
for molecule in ["OH", "CO", "NO", "NO2"]:
    print("Downloading and caching ", molecule)
    fetch_hitemp(molecule, isotope='1',                   # only 1 HITEMP file so all isotopes are downloaded anyway
                 load_wavenum_min=2000,  # keep memory usage low. only 1 HITEMP file so everything is downloaded anyway
                 load_wavenum_max=5000,   
                 verbose=3)

# Not downloaded because to big for Binder / GESIS : CH4, N2O (we could actually try N2O)

# Downloaded and computed separately: CO2, H2O