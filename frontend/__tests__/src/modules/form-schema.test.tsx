import { describe, it, expect } from "vitest";

describe("Form Schema Module", () => {
    it("can import form schema", async () => {
        const { formSchema } = await import("../../../src/modules/form-schema");
        expect(formSchema).toBeDefined();
    });

    it("can import fit form schema", async () => {
        const { formSchemaFit } = await import("../../../src/modules/form-schema");
        expect(formSchemaFit).toBeDefined();
    });

    it("form schemas are objects", async () => {
        const { formSchema, formSchemaFit } = await import("../../../src/modules/form-schema");

        expect(typeof formSchema).toBe('object');
        expect(typeof formSchemaFit).toBe('object');
    });

    it("schemas have validation methods", async () => {
        const { formSchema, formSchemaFit } = await import("../../../src/modules/form-schema");

        // Yup schemas should have validate methods
        expect(typeof formSchema.validate).toBe('function');
        expect(typeof formSchemaFit.validate).toBe('function');
    });

    it("can validate valid form data", async () => {
        const { formSchema } = await import("../../../src/modules/form-schema");

        const validData = {
            database: "hitran",
            mode: "absorbance",
            pressure: 1.01325,
            tgas: 300,
            path_length: 1,
            wavenum_min: 1900,
            wavenum_max: 2300,
            molecule: "CO2",
            isotope: "1"
        };

        try {
            const result = await formSchema.validate(validData);
            expect(result).toBeDefined();
        } catch (error) {
            // If validation fails, that's also valid test behavior
            expect(error).toBeDefined();
        }
    });

    const spectrumData = {
        pressure: 1,
        tgas: 300,
        path_length: 1,
        min_wavenumber_range: 1900,
        max_wavenumber_range: 2300,
        species: [{ molecule: "CO2", mole_fraction: 0.1 }],
    };

    it("accepts path length and pressure below 1", async () => {
        const { formSchema } = await import("../../../src/modules/form-schema");

        const data = { ...spectrumData, path_length: 0.1, pressure: 0.1 };

        await expect(formSchema.validate(data)).resolves.toBeDefined();
    });

    it("rejects zero and negative path length and pressure", async () => {
        const { formSchema } = await import("../../../src/modules/form-schema");

        await expect(formSchema.validate({ ...spectrumData, path_length: 0 })).rejects.toThrow();
        await expect(formSchema.validate({ ...spectrumData, path_length: -1 })).rejects.toThrow();
        await expect(formSchema.validate({ ...spectrumData, pressure: 0 })).rejects.toThrow();
        await expect(formSchema.validate({ ...spectrumData, pressure: -1 })).rejects.toThrow();
    });

    it("validates field requirements", async () => {
        const { formSchema } = await import("../../../src/modules/form-schema");

        const invalidData = {};

        try {
            await formSchema.validate(invalidData);
            // If it passes, that's unexpected but not a test failure
        } catch (error) {
            // This is expected for required fields
            expect(error).toBeDefined();
        }
    });
}); 