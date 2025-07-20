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
        .typeError("Mole fraction must be defined")
        .min(0, "Mole fraction must be between 0 and 1")
        .max(1, "Mole fraction must be between 0 and 1"),
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

export const formSchemaFit = yup.object().shape({
  fit_properties: yup.object().shape({
    method: yup.string().required(),
    fit_var: yup.string().required(),
    normalize: yup.boolean().required(),
    max_loops: yup.number()
      .typeError("Max loops must be defined")
      .required("Max loops must be defined"),
    tol: yup.number().required().default(1e-15),
  }),
  bounding_ranges: yup.object().shape({
    tgas: yup.object().shape({
      min: yup.number(),
      max: yup.number(),
    }).nullable(),
    tvib: yup.object().shape({
      min: yup.number(),
      max: yup.number(),
    }).nullable(),
    trot: yup.object().shape({
      min: yup.number(),
      max: yup.number(),
    }).nullable(),
    mole_fraction: yup.object().shape({
      min: yup.number(),
      max: yup.number(),
    }).nullable(),
    pressure: yup.object().shape({
      min: yup.number(),
      max: yup.number(),
    }).nullable(),
  }),
  fit_parameters: yup.object().shape({
    tgas: yup
      .number()
      .nullable()
      .when('$fit_parameters_tgas_required', {
        is: true,
        then: yup
          .number()
          .required("Tgas must be defined")
          .typeError("Tgas must be defined")
          .max(9000, "Tgas must be between 1K and 9000K")
          .min(1, "Tgas must be between 1K and 9000K"),
      }),
    tvib: yup
      .number()
      .nullable()
      .when('$fit_parameters_tvib_required', {
        is: true,
        then: yup
          .number()
          .required("TVib must be defined")
          .typeError("TVib must be defined")
          .max(9000, "TVib must be between 1K and 9000K")
          .min(1, "TVib must be between 1K and 9000K"),
      }),
    trot: yup
      .number()
      .nullable()
      .when('$fit_parameters_trot_required', {
        is: true,
        then: yup
          .number()
          .required("TRot must be defined")
          .typeError("TRot must be defined")
          .max(9000, "TRot must be between 1K and 9000K")
          .min(1, "TRot must be between 1K and 9000K"),
      }),
    mole_fraction: yup
      .number()
      .nullable()
      .when('$fit_parameters_mole_fraction_required', {
        is: true,
        then: yup
          .number()
          .required("Mole fraction must be defined")
          .typeError("Mole fraction must be defined")
          .max(1, "Mole fraction must be between 0 and 1")
          .min(0, "Mole fraction must be between 0 and 1"),
      }),
    pressure: yup
      .number()
      .nullable()
      .when('$fit_parameters_pressure_required', {
        is: true,
        then: yup
          .number()
          .required("Pressure must be defined")
          .typeError("Pressure must be defined")
          .min(0.1, "Pressure must be positive"),
      }),
  }),
  experimental_conditions: yup.object().shape({
    // mode: yup.string().required(),
    database: yup.string().required(),
    specie: yup.object().shape({
      molecule: yup
        .string()
        .required("Molecule must be defined")
        .typeError("Molecule must be defined"),
      mole_fraction: yup
        .number()
        .required("Mole fraction must be defined")
        .typeError("Mole fraction must be defined")
        .min(0, "Mole fraction must be between 0 and 1")
        .max(1, "Mole fraction must be between 0 and 1"),
    }),
    min_wavenumber_range: yup
      .number()
      .required("Min wavenumber range must be defined")
      .typeError("Min wavenumber range must be defined"),
    max_wavenumber_range: yup
      .number()
      .required("Max wavenumber range must be defined")
      .typeError("Max wavenumber range must be defined"),
    pressure: yup
      .number()
      .required("Pressure must be defined")
      .typeError("Pressure must be defined")
      .min(1, "Pressure cannot be negative"),
    path_length: yup
      .number()
      .required("Path length must be defined")
      .typeError("Path length must be defined")
      .min(1, "Path length cannot be negative"),
    simulate_slit: yup.number().nullable(),
    use_simulate_slit: yup.boolean().required().default(false),
    wavelength_units: yup.string().required(),
    pressure_units: yup.string().required(),
    path_length_units: yup.string().required(),
  }),
  spectrum_file: yup.mixed().required().nullable(),
  use_simulate_slit: yup.boolean().nullable(),
  simulate_slit: yup.number().nullable(),
});
