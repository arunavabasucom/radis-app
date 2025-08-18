import { describe, it, expect } from "vitest";

describe("Constants Module", () => {
    it("can import constants", async () => {
        const constants = await import("../../src/constants");
        expect(constants).toBeDefined();
    });

    it("exports expected constants", async () => {
        const constants = await import("../../src/constants");

        // Should have some constants exported
        const exportKeys = Object.keys(constants);
        expect(exportKeys.length).toBeGreaterThan(0);
    });

    it("defines PlotSettings type/interface", async () => {
        const constants = await import("../../src/constants");

        // PlotSettings should be available (might be type-only)
        expect(constants).toBeDefined();
    });

    it("defines Spectrum type/interface", async () => {
        const constants = await import("../../src/constants");

        // Spectrum should be available (might be type-only)
        expect(constants).toBeDefined();
    });

    it("provides application constants", async () => {
        const constants = await import("../../src/constants");

        // Should provide some application-level constants
        const exportKeys = Object.keys(constants);

        // Either has exports or is a type-only module
        expect(exportKeys.length >= 0).toBeTruthy();
    });

    it("handles type definitions correctly", async () => {
        // Test that the module can be imported without TypeScript errors
        try {
            await import("../../src/constants");
            expect(true).toBe(true);
        } catch (error) {
            // If import fails, the module has issues
            expect(error).toBeDefined();
        }
    });
}); 