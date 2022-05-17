# -*- coding: utf-8 -*-
"""
Download some molecules from GEISA data, parse & cache them, to make 
sure the example notebooks run fast.
"""

from radis.io.geisa import fetch_geisa

# More molecules will be confirmed and added in upcoming updates
GEISA_working_molecules = [
    'C2H2',
    'C2H4',
    'C2H6',
    'CH4',
    'CO',
    'CO2',
    'H2O',
    'O3',
    'N2O',
    'NO',
    'NO2'
]

for molecule in GEISA_working_molecules:
    fetch_geisa(molecule)