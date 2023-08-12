# -*- coding: utf-8 -*-
"""
Download HITEMP H2O database, parse & cache them, to make sure the example notebooks run fast 
"""

from radis.test.utils import setup_test_line_databases
from radis.io.hitemp import fetch_hitemp

setup_test_line_databases()  # init radis.json etc if needed

for (wmin, wmax) in [(0,     50),
                    (50,    150),
                    (150,   250),
                    (250,   350),
                    (350,   500),	 
                    (500,   600),	 
                    (600,   700),
                    (700,   800),
                    (800,   900),	 
                    (900,   1000),	 
                    (1000,  1150),	 
                    (1150,  1300),	 
                    (1300,  1500),	 
                    (1500,  1750),	 
                    (1750,  2000),	 
                    (2000,  2250),	 
                    (2250,  2500),
                    (2500,  2750),
                    (2750,  3000),
                    (3000,  3250),
                    (3250,  3500),
                    (3500,  4150),	 
                    (4150,  4500),
                    (4500,  5000),
                    (5000,  5500),	 
                    (5500,  6000),
                    (6000,  6500),
                    (6500,  7000),
                    (7000,  7500),
                    (7500,  8000),
                    (8000,  8500),
                    (8500,  9000),
                    (9000,  11000),	 
                    (11000, 30000)]:
    fetch_hitemp("H2O", isotope='1',                   # only 1 HITEMP file so all isotopes are downloaded anyway
                 load_wavenum_min=wmin, 
                 load_wavenum_max=wmax,   
                 verbose=3)