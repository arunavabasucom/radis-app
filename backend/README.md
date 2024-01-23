###  request 

```json
{
  "species": [
    {
      "molecule": "CO",
      "mole_fraction": 0.2
    }
  ],
  "mode": "absorbance",
  "database": "hitran",
  "tgas": 300,
  "min_wavenumber_range": 1900,
  "max_wavenumber_range": 2300,
  "pressure": 1.01325,
  "path_length": 1,
  "use_simulate_slit": true,
  "simulate_slit": 5,
  "path_length_units": "u.cm",
  "pressure_units": "u.bar",
  "wavelength_units":"1/u.cm"
}
```

to run the srever 
`uvicorn src.main:app --reload`

we need to start redis cli to get the keys and all the values
`redis-cli -h localhost -p 6379`

to start redis server 
`redis-server`

`rm -rf  radis.json .radisdb`

info about the file 
`ls -lh CO.hdf5`