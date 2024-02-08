# Backend 

sample request 

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