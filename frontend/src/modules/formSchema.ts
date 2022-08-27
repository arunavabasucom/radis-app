import * as yup from "yup";

export const formSchema = yup.object().shape({
  useNonEqi: yup.boolean(),
  use_simulate_slit: yup.boolean(),
  path_length: yup
    .number()
    .required("Path length must be defined")
    .typeError("Path length must be defined")
    .min(1, "Path length cannot be negative"),
  pressure: yup
    .number()
    .required("Pressure must be defined")
    .typeError("Pressure must be defined")
    .min(1, "Pressure cannot be negative"),
  tgas: yup
    .number()
    .required("Tgas must be defined")
    .typeError("Tgas must be defined")
    .max(9000, "Tgas must be between 1K and 9000K")
    .min(1, "Tgas must be between 1K and 9000K"),
  trot: yup
    .number()
    .typeError("TRot must be defined")
    .when("useNonEqi", {
      is: true,
      then: yup
        .number()
        .required("Trot must be defined")
        .typeError("TRot must be defined")
        .min(0, "TRot must be positive"),
    }),
  tvib: yup
    .number()
    .typeError("TRot must be defined")
    .when("useNonEqi", {
      is: true,
      then: yup
        .number()
        .required("TVib must be defined")
        .typeError("TVib must be defined")
        .min(0, "TVib must be positive"),
    }),
  min_wavenumber_range: yup
    .number()
    .required("Min wavenumber range must be defined")
    .typeError("Min wavenumber range must be defined"),
  max_wavenumber_range: yup
    .number()
    .required("Max wavenumber range must be defined")
    .typeError("Max wavenumber range must be defined"),
  species: yup.array().of(
    yup.object().shape({
      molecule: yup
        .string()
        .required("Molecule must be defined")
        .typeError("Molecule must be defined"),
      mole_fraction: yup
        .number()
        .required("Mole fraction must be defined")
        .typeError("Mole fraction must be defined"),
    })
  ),
  simulate_slit: yup
    .number()
    .typeError("Simulate slit must be defined")
    .min(0, "Simulate slit must be positive")
    .max(30, "Simulate slit must be less than 30")
    .when("useSlitSwitch", {
      is: true,
      then: yup
        .number()
        .typeError("Simulate slit must be defined")
        .min(0, "Simulate slit must be positive")
        .max(30, "Simulate slit must be less than 30"),
    }),
});
