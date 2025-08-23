import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useFitFormStore from "../../../src/store/fitForm";
import { Database } from "../../../src/components/types";

// Mock zustand devtools
vi.mock("zustand/middleware", () => ({
    devtools: (fn: any) => fn,
}));

describe("useFitFormStore", () => {
    beforeEach(() => {
        // Reset store to initial state before each test
        const { result } = renderHook(() => useFitFormStore());
        act(() => {
            result.current.setFitMethod("least_squares");
            result.current.setFitVar("absorbance");
            result.current.setNormalize(false);
            result.current.setMaxLoops(200);
            result.current.setTol(1e-15);
            result.current.setTgasBoundingRange({ min: 500, max: 2000 });
            result.current.setTvibBoundingRange({ min: 500, max: 2000 });
            result.current.setTrotBoundingRange({ min: 500, max: 2000 });
            result.current.setMoleFractionBoundingRange({ min: 0.001, max: 1.0 });
            result.current.setPressureBoundingRange({ min: 0.1, max: 10.0 });
            result.current.setFitTgas(300);
            result.current.setFitTvib(300);
            result.current.setFitTrot(300);
            result.current.setFitMoleFraction(0.1);
            result.current.setFitPressure(1.01325);
            result.current.setMode("radiance");
            result.current.setDatabase(Database.HITRAN);
            result.current.setMolecule("CO");
            result.current.setMoleFraction(0.1);
            result.current.setMinWavenumberRange(1900);
            result.current.setMaxWavenumberRange(2100);
            result.current.setPressure(1.01325);
            result.current.setPathLength(1.0);
            result.current.setSimulateSlit(undefined);
            result.current.setUseSimulateSlit(false);
            result.current.setWavelengthUnits("nm");
            result.current.setPressureUnits("bar");
            result.current.setPathLengthUnits("cm");
            result.current.setSpectrumFile(null);
            result.current.setUseSimulateSlitTop(false);
            result.current.setSimulateSlitTop(undefined);
            result.current.setTgasSelected(false);
            result.current.setTvibSelected(false);
            result.current.setTrotSelected(false);
            result.current.setMoleFractionSelected(false);
            result.current.setPressureSelected(false);
        });
    });

    describe("Initial State", () => {
        it("should have correct initial fit properties", () => {
            const { result } = renderHook(() => useFitFormStore());

            expect(result.current.fit_properties.method).toBe("least_squares");
            expect(result.current.fit_properties.fit_var).toBe("absorbance");
            expect(result.current.fit_properties.normalize).toBe(false);
            expect(result.current.fit_properties.max_loops).toBe(200);
            expect(result.current.fit_properties.tol).toBe(1e-15);
        });

        it("should have correct initial bounding ranges", () => {
            const { result } = renderHook(() => useFitFormStore());

            expect(result.current.bounding_ranges.tgas).toEqual({ min: 500, max: 2000 });
            expect(result.current.bounding_ranges.tvib).toEqual({ min: 500, max: 2000 });
            expect(result.current.bounding_ranges.trot).toEqual({ min: 500, max: 2000 });
            expect(result.current.bounding_ranges.mole_fraction).toEqual({ min: 0.001, max: 1.0 });
            expect(result.current.bounding_ranges.pressure).toEqual({ min: 0.1, max: 10.0 });
        });

        it("should have correct initial fit parameters", () => {
            const { result } = renderHook(() => useFitFormStore());

            expect(result.current.fit_parameters.tgas).toBe(300);
            expect(result.current.fit_parameters.tvib).toBe(300);
            expect(result.current.fit_parameters.trot).toBe(300);
            expect(result.current.fit_parameters.mole_fraction).toBe(0.1);
            expect(result.current.fit_parameters.pressure).toBe(1.01325);
        });

        it("should have correct initial experimental conditions", () => {
            const { result } = renderHook(() => useFitFormStore());

            expect(result.current.experimental_conditions.mode).toBe("radiance");
            expect(result.current.experimental_conditions.database).toBe(Database.HITRAN);
            expect(result.current.experimental_conditions.specie.molecule).toBe("CO");
            expect(result.current.experimental_conditions.specie.mole_fraction).toBe(0.1);
            expect(result.current.experimental_conditions.specie.is_all_isotopes).toBe(false);
            expect(result.current.experimental_conditions.min_wavenumber_range).toBe(1900);
            expect(result.current.experimental_conditions.max_wavenumber_range).toBe(2100);
            expect(result.current.experimental_conditions.pressure).toBe(1.01325);
            expect(result.current.experimental_conditions.path_length).toBe(1.0);
            expect(result.current.experimental_conditions.simulate_slit).toBeUndefined();
            expect(result.current.experimental_conditions.use_simulate_slit).toBe(false);
            expect(result.current.experimental_conditions.wavelength_units).toBe("nm");
            expect(result.current.experimental_conditions.pressure_units).toBe("bar");
            expect(result.current.experimental_conditions.path_length_units).toBe("cm");
        });

        it("should have correct initial selected fit parameters", () => {
            const { result } = renderHook(() => useFitFormStore());

            expect(result.current.selected_fit_parameters.tgas).toBe(false);
            expect(result.current.selected_fit_parameters.tvib).toBe(false);
            expect(result.current.selected_fit_parameters.trot).toBe(false);
            expect(result.current.selected_fit_parameters.mole_fraction).toBe(false);
            expect(result.current.selected_fit_parameters.pressure).toBe(false);
        });

        it("should have correct initial top level properties", () => {
            const { result } = renderHook(() => useFitFormStore());

            expect(result.current.use_simulate_slit).toBe(false);
            expect(result.current.simulate_slit).toBeUndefined();
            expect(result.current.spectrum_file).toBeNull();
        });
    });

    describe("Fit Properties Setters", () => {
        it("should set fit method", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitMethod("least_squares");
            });

            expect(result.current.fit_properties.method).toBe("least_squares");
        });

        it("should set fit variable", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitVar("transmittance_noslit");
            });

            expect(result.current.fit_properties.fit_var).toBe("transmittance_noslit");
        });

        it("should set normalize", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setNormalize(true);
            });

            expect(result.current.fit_properties.normalize).toBe(true);
        });

        it("should set max loops", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMaxLoops(500);
            });

            expect(result.current.fit_properties.max_loops).toBe(500);
        });

        it("should set tolerance", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setTol(1e-10);
            });

            expect(result.current.fit_properties.tol).toBe(1e-10);
        });
    });

    describe("Bounding Ranges Setters", () => {
        it("should set tgas bounding range", () => {
            const { result } = renderHook(() => useFitFormStore());
            const newRange = { min: 100, max: 500 };

            act(() => {
                result.current.setTgasBoundingRange(newRange);
            });

            expect(result.current.bounding_ranges.tgas).toEqual(newRange);
        });

        it("should set tvib bounding range", () => {
            const { result } = renderHook(() => useFitFormStore());
            const newRange = { min: 200, max: 600 };

            act(() => {
                result.current.setTvibBoundingRange(newRange);
            });

            expect(result.current.bounding_ranges.tvib).toEqual(newRange);
        });

        it("should set trot bounding range", () => {
            const { result } = renderHook(() => useFitFormStore());
            const newRange = { min: 150, max: 450 };

            act(() => {
                result.current.setTrotBoundingRange(newRange);
            });

            expect(result.current.bounding_ranges.trot).toEqual(newRange);
        });

        it("should set mole fraction bounding range", () => {
            const { result } = renderHook(() => useFitFormStore());
            const newRange = { min: 0.01, max: 0.5 };

            act(() => {
                result.current.setMoleFractionBoundingRange(newRange);
            });

            expect(result.current.bounding_ranges.mole_fraction).toEqual(newRange);
        });

        it("should set pressure bounding range", () => {
            const { result } = renderHook(() => useFitFormStore());
            const newRange = { min: 0.5, max: 5.0 };

            act(() => {
                result.current.setPressureBoundingRange(newRange);
            });

            expect(result.current.bounding_ranges.pressure).toEqual(newRange);
        });

        it("should handle undefined bounding ranges", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setTgasBoundingRange(undefined);
            });

            expect(result.current.bounding_ranges.tgas).toBeUndefined();
        });
    });

    describe("Fit Parameters Setters", () => {
        it("should set fit tgas", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitTgas(400);
            });

            expect(result.current.fit_parameters.tgas).toBe(400);
        });

        it("should set fit tvib", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitTvib(450);
            });

            expect(result.current.fit_parameters.tvib).toBe(450);
        });

        it("should set fit trot", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitTrot(500);
            });

            expect(result.current.fit_parameters.trot).toBe(500);
        });

        it("should set fit mole fraction", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitMoleFraction(0.2);
            });

            expect(result.current.fit_parameters.mole_fraction).toBe(0.2);
        });

        it("should set fit pressure", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitPressure(2.0);
            });

            expect(result.current.fit_parameters.pressure).toBe(2.0);
        });

        it("should handle undefined fit parameters", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitTgas(undefined);
            });

            expect(result.current.fit_parameters.tgas).toBeUndefined();
        });
    });

    describe("Experimental Conditions Setters", () => {
        it("should set mode", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMode("absorbance");
            });

            expect(result.current.experimental_conditions.mode).toBe("absorbance");
        });

        it("should set database", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setDatabase(Database.GEISA);
            });

            expect(result.current.experimental_conditions.database).toBe(Database.GEISA);
        });

        it("should set molecule", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMolecule("CO2");
            });

            expect(result.current.experimental_conditions.specie.molecule).toBe("CO2");
        });

        it("should set mole fraction", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMoleFraction(0.15);
            });

            expect(result.current.experimental_conditions.specie.mole_fraction).toBe(0.15);
        });

        it("should set min wavenumber range", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMinWavenumberRange(1800);
            });

            expect(result.current.experimental_conditions.min_wavenumber_range).toBe(1800);
        });

        it("should set max wavenumber range", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMaxWavenumberRange(2200);
            });

            expect(result.current.experimental_conditions.max_wavenumber_range).toBe(2200);
        });

        it("should set pressure", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setPressure(1.5);
            });

            expect(result.current.experimental_conditions.pressure).toBe(1.5);
        });

        it("should set path length", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setPathLength(2.0);
            });

            expect(result.current.experimental_conditions.path_length).toBe(2.0);
        });

        it("should set simulate slit", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setSimulateSlit(0.5);
            });

            expect(result.current.experimental_conditions.simulate_slit).toBe(0.5);
        });

        it("should set use simulate slit", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setUseSimulateSlit(true);
            });

            expect(result.current.experimental_conditions.use_simulate_slit).toBe(true);
        });

        it("should set wavelength units", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setWavelengthUnits("cm-1");
            });

            expect(result.current.experimental_conditions.wavelength_units).toBe("cm-1");
        });

        it("should set pressure units", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setPressureUnits("atm");
            });

            expect(result.current.experimental_conditions.pressure_units).toBe("atm");
        });

        it("should set path length units", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setPathLengthUnits("m");
            });

            expect(result.current.experimental_conditions.path_length_units).toBe("m");
        });
    });

    describe("Spectrum File Setter", () => {
        it("should set spectrum file", () => {
            const { result } = renderHook(() => useFitFormStore());
            const mockFile = new File(["test"], "test.txt", { type: "text/plain" });

            act(() => {
                result.current.setSpectrumFile(mockFile);
            });

            expect(result.current.spectrum_file).toBe(mockFile);
        });

        it("should set spectrum file to null", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setSpectrumFile(null);
            });

            expect(result.current.spectrum_file).toBeNull();
        });
    });

    describe("Top Level Setters", () => {
        it("should set use simulate slit top", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setUseSimulateSlitTop(true);
            });

            expect(result.current.use_simulate_slit).toBe(true);
        });

        it("should set simulate slit top", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setSimulateSlitTop(1.0);
            });

            expect(result.current.simulate_slit).toBe(1.0);
        });
    });

    describe("Selected Fit Parameters Setters", () => {
        it("should set tgas selected", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setTgasSelected(true);
            });

            expect(result.current.selected_fit_parameters.tgas).toBe(true);
        });

        it("should set tvib selected", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setTvibSelected(true);
            });

            expect(result.current.selected_fit_parameters.tvib).toBe(true);
        });

        it("should set trot selected", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setTrotSelected(true);
            });

            expect(result.current.selected_fit_parameters.trot).toBe(true);
        });

        it("should set mole fraction selected", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMoleFractionSelected(true);
            });

            expect(result.current.selected_fit_parameters.mole_fraction).toBe(true);
        });

        it("should set pressure selected", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setPressureSelected(true);
            });

            expect(result.current.selected_fit_parameters.pressure).toBe(true);
        });

        it("should handle multiple selected parameters", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setTgasSelected(true);
                result.current.setTvibSelected(true);
                result.current.setPressureSelected(true);
            });

            expect(result.current.selected_fit_parameters.tgas).toBe(true);
            expect(result.current.selected_fit_parameters.tvib).toBe(true);
            expect(result.current.selected_fit_parameters.trot).toBe(false);
            expect(result.current.selected_fit_parameters.mole_fraction).toBe(false);
            expect(result.current.selected_fit_parameters.pressure).toBe(true);
        });
    });

    describe("State Persistence", () => {
        it("should maintain state across multiple updates", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitMethod("least_squares");
                result.current.setFitVar("radiance_noslit");
                result.current.setNormalize(true);
                result.current.setMaxLoops(300);
                result.current.setTol(1e-12);
            });

            expect(result.current.fit_properties.method).toBe("least_squares");
            expect(result.current.fit_properties.fit_var).toBe("radiance_noslit");
            expect(result.current.fit_properties.normalize).toBe(true);
            expect(result.current.fit_properties.max_loops).toBe(300);
            expect(result.current.fit_properties.tol).toBe(1e-12);
        });

        it("should handle complex state updates", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setDatabase(Database.EXOMOL);
                result.current.setMolecule("H2O");
                result.current.setMoleFraction(0.05);
                result.current.setTgasBoundingRange({ min: 100, max: 1000 });
                result.current.setFitTgas(250);
                result.current.setTgasSelected(true);
            });

            expect(result.current.experimental_conditions.database).toBe(Database.EXOMOL);
            expect(result.current.experimental_conditions.specie.molecule).toBe("H2O");
            expect(result.current.experimental_conditions.specie.mole_fraction).toBe(0.05);
            expect(result.current.bounding_ranges.tgas).toEqual({ min: 100, max: 1000 });
            expect(result.current.fit_parameters.tgas).toBe(250);
            expect(result.current.selected_fit_parameters.tgas).toBe(true);
        });
    });

    describe("Edge Cases", () => {
        it("should handle zero values", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitTgas(0);
                result.current.setFitPressure(0);
                result.current.setMoleFraction(0);
            });

            expect(result.current.fit_parameters.tgas).toBe(0);
            expect(result.current.fit_parameters.pressure).toBe(0);
            expect(result.current.experimental_conditions.specie.mole_fraction).toBe(0);
        });

        it("should handle negative values", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setFitTgas(-100);
                result.current.setFitPressure(-1.0);
            });

            expect(result.current.fit_parameters.tgas).toBe(-100);
            expect(result.current.fit_parameters.pressure).toBe(-1.0);
        });

        it("should handle very large values", () => {
            const { result } = renderHook(() => useFitFormStore());

            act(() => {
                result.current.setMaxLoops(10000);
                result.current.setTol(1e-20);
            });

            expect(result.current.fit_properties.max_loops).toBe(10000);
            expect(result.current.fit_properties.tol).toBe(1e-20);
        });

        it("should handle all database types", () => {
            const { result } = renderHook(() => useFitFormStore());

            const databases = [Database.HITRAN, Database.GEISA, Database.HITEMP, Database.EXOMOL, Database.NIST];

            databases.forEach(db => {
                act(() => {
                    result.current.setDatabase(db);
                });
                expect(result.current.experimental_conditions.database).toBe(db);
            });
        });

        it("should handle all fit variable types", () => {
            const { result } = renderHook(() => useFitFormStore());

            const fitVars = ["absorbance", "transmittance_noslit", "radiance_noslit", "transmittance", "radiance"];

            fitVars.forEach(fitVar => {
                act(() => {
                    result.current.setFitVar(fitVar as any);
                });
                expect(result.current.fit_properties.fit_var).toBe(fitVar);
            });
        });
    });
}); 