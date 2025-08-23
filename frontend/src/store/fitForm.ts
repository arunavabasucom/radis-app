import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { FitFormValues, Database } from "../components/types";

interface TFitFormState extends FitFormValues {
}

interface TFitFormActions {
    // Fit Properties setters
    setFitMethod: (method: "least_squares") => void;
    setFitVar: (fitVar: "absorbance" | "transmittance_noslit" | "radiance_noslit" | "transmittance" | "radiance") => void;
    setNormalize: (normalize: boolean) => void;
    setMaxLoops: (maxLoops: number) => void;
    setTol: (tol: number) => void;

    // Bounding Ranges setters
    setTgasBoundingRange: (range: { min: number; max: number } | undefined) => void;
    setTvibBoundingRange: (range: { min: number; max: number } | undefined) => void;
    setTrotBoundingRange: (range: { min: number; max: number } | undefined) => void;
    setMoleFractionBoundingRange: (range: { min: number; max: number } | undefined) => void;
    setPressureBoundingRange: (range: { min: number; max: number } | undefined) => void;

    // Fit Parameters setters
    setFitTgas: (tgas: number | undefined) => void;
    setFitTvib: (tvib: number | undefined) => void;
    setFitTrot: (trot: number | undefined) => void;
    setFitMoleFraction: (moleFraction: number | undefined) => void;
    setFitPressure: (pressure: number | undefined) => void;

    // Experimental Conditions setters
    setMode: (mode: string) => void;
    setDatabase: (database: Database) => void;
    setMolecule: (molecule: string) => void;
    setMoleFraction: (moleFraction: number) => void;
    setMinWavenumberRange: (min: number) => void;
    setMaxWavenumberRange: (max: number) => void;
    setPressure: (pressure: number) => void;
    setPathLength: (pathLength: number) => void;
    setSimulateSlit: (simulateSlit: number | undefined) => void;
    setUseSimulateSlit: (useSimulateSlit: boolean) => void;
    setWavelengthUnits: (units: string) => void;
    setPressureUnits: (units: string) => void;
    setPathLengthUnits: (units: string) => void;

    // Spectrum File setters
    setSpectrumFile: (file: File | null) => void;

    // Top level setters
    setUseSimulateSlitTop: (useSimulateSlit: boolean) => void;
    setSimulateSlitTop: (simulateSlit: number | undefined) => void;

    // Selected Fit Parameters setters
    setTgasSelected: (selected: boolean) => void;
    setTvibSelected: (selected: boolean) => void;
    setTrotSelected: (selected: boolean) => void;
    setMoleFractionSelected: (selected: boolean) => void;
    setPressureSelected: (selected: boolean) => void;
}

const initialState: FitFormValues = {
    fit_properties: {
        method: "least_squares",
        fit_var: "absorbance",
        normalize: false,
        max_loops: 200,
        tol: 1e-15,
    },
    bounding_ranges: {
        tgas: { min: 500, max: 2000 },
        tvib: { min: 500, max: 2000 },
        trot: { min: 500, max: 2000 },
        mole_fraction: { min: 0.001, max: 1.0 },
        pressure: { min: 0.1, max: 10.0 },
    },
    fit_parameters: {
        tgas: 300,
        tvib: 300,
        trot: 300,
        mole_fraction: .1,
        pressure: 1.01325,
    },
    experimental_conditions: {
        mode: "radiance",
        database: Database.HITRAN,
        specie: { molecule: "CO", mole_fraction: 0.1, is_all_isotopes: false },
        min_wavenumber_range: 1900,
        max_wavenumber_range: 2100,
        pressure: 1.01325,
        path_length: 1.0,
        simulate_slit: undefined,
        use_simulate_slit: false,
        wavelength_units: "nm",
        pressure_units: "bar",
        path_length_units: "cm",
    },
    use_simulate_slit: false,
    simulate_slit: undefined,
    selected_fit_parameters: {
        tgas: false,
        tvib: false,
        trot: false,
        mole_fraction: false,
        pressure: false,
    },
    spectrum_file: null,
};

const useFitFormStore = create<TFitFormState & TFitFormActions>()(
    devtools((set) => ({
        ...initialState,

        // Fit Properties setters
        setFitMethod: (method) =>
            set((state) => ({
                fit_properties: { ...state.fit_properties, method }
            })),
        setFitVar: (fitVar) =>
            set((state) => ({
                fit_properties: { ...state.fit_properties, fit_var: fitVar }
            })),
        setNormalize: (normalize) =>
            set((state) => ({
                fit_properties: { ...state.fit_properties, normalize }
            })),
        setMaxLoops: (maxLoops) =>
            set((state) => ({
                fit_properties: { ...state.fit_properties, max_loops: maxLoops }
            })),
        setTol: (tol) =>
            set((state) => ({
                fit_properties: { ...state.fit_properties, tol }
            })),

        // Bounding Ranges setters
        setTgasBoundingRange: (range) =>
            set((state) => ({
                bounding_ranges: { ...state.bounding_ranges, tgas: range }
            })),
        setTvibBoundingRange: (range) =>
            set((state) => ({
                bounding_ranges: { ...state.bounding_ranges, tvib: range }
            })),
        setTrotBoundingRange: (range) =>
            set((state) => ({
                bounding_ranges: { ...state.bounding_ranges, trot: range }
            })),
        setMoleFractionBoundingRange: (range) =>
            set((state) => ({
                bounding_ranges: { ...state.bounding_ranges, mole_fraction: range }
            })),
        setPressureBoundingRange: (range) =>
            set((state) => ({
                bounding_ranges: { ...state.bounding_ranges, pressure: range }
            })),

        // Fit Parameters setters
        setFitTgas: (tgas) =>
            set((state) => ({
                fit_parameters: { ...state.fit_parameters, tgas }
            })),
        setFitTvib: (tvib) =>
            set((state) => ({
                fit_parameters: { ...state.fit_parameters, tvib }
            })),
        setFitTrot: (trot) =>
            set((state) => ({
                fit_parameters: { ...state.fit_parameters, trot }
            })),
        setFitMoleFraction: (moleFraction) =>
            set((state) => ({
                fit_parameters: { ...state.fit_parameters, mole_fraction: moleFraction }
            })),
        setFitPressure: (pressure) =>
            set((state) => ({
                fit_parameters: { ...state.fit_parameters, pressure }
            })),

        // Experimental Conditions setters
        setMode: (mode) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, mode }
            })),
        setDatabase: (database) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, database }
            })),
        setMolecule: (molecule) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, specie: { ...state.experimental_conditions.specie, molecule } }
            })),
        setMoleFraction: (moleFraction) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, specie: { ...state.experimental_conditions.specie, mole_fraction: moleFraction } }
            })),
        setMinWavenumberRange: (min) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, min_wavenumber_range: min }
            })),
        setMaxWavenumberRange: (max) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, max_wavenumber_range: max }
            })),
        setPressure: (pressure) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, pressure }
            })),
        setPathLength: (pathLength) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, path_length: pathLength }
            })),
        setSimulateSlit: (simulateSlit) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, simulate_slit: simulateSlit }
            })),
        setUseSimulateSlit: (useSimulateSlit) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, use_simulate_slit: useSimulateSlit }
            })),
        setWavelengthUnits: (units) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, wavelength_units: units }
            })),
        setPressureUnits: (units) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, pressure_units: units }
            })),
        setPathLengthUnits: (units) =>
            set((state) => ({
                experimental_conditions: { ...state.experimental_conditions, path_length_units: units }
            })),
        setSpectrumFile: (file: File | null) =>
            set(() => ({
                spectrum_file: file
            })),
        // Top level setters
        setUseSimulateSlitTop: (useSimulateSlit) =>
            set(() => ({
                use_simulate_slit: useSimulateSlit
            })),
        setSimulateSlitTop: (simulateSlit) =>
            set(() => ({
                simulate_slit: simulateSlit
            })),

        // Selected Fit Parameters setters
        setTgasSelected: (selected) =>
            set((state) => ({
                selected_fit_parameters: { ...state.selected_fit_parameters, tgas: selected }
            })),
        setTvibSelected: (selected) =>
            set((state) => ({
                selected_fit_parameters: { ...state.selected_fit_parameters, tvib: selected }
            })),
        setTrotSelected: (selected) =>
            set((state) => ({
                selected_fit_parameters: { ...state.selected_fit_parameters, trot: selected }
            })),
        setMoleFractionSelected: (selected) =>
            set((state) => ({
                selected_fit_parameters: { ...state.selected_fit_parameters, mole_fraction: selected }
            })),
        setPressureSelected: (selected) =>
            set((state) => ({
                selected_fit_parameters: { ...state.selected_fit_parameters, pressure: selected }
            })),
    }))

);

export default useFitFormStore;
