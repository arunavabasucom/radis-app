# -*- coding: utf-8 -*-
"""
Download some molecules from HITRAN data, parse & cache them, to make 
sure the example notebooks run fast.
"""

from radis.io.hitran import fetch_hitran

for molecule in [
    "C2H2",
    "C2H4",
    "C2H6",
    "CH4",
    "CO",
    "CO2",
    "H2O",
    "O3",
    "N2O",
    "NH3",
    "NO",
    "NO2",
]:
    fetch_hitran(molecule, parse_quanta=molecule in ["CO", "CO2"])
