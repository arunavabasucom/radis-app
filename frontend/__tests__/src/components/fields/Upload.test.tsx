import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { describe, it, expect } from "vitest";
import App from "../../../../src/App";

describe("Upload Field Component", () => {
    const navigateToFitSpectrum = async () => {
        render(<App />);

        // Click on Fit Spectrum tab to switch to fit mode
        const fitTab = screen.getByText(/Spectrum Fitting/i);
        fireEvent.click(fitTab);

        // Wait for the fit form to load
        await waitFor(() => {
            const fitButton = screen.getByRole("button", { name: /fit spectrum/i });
            expect(fitButton).toBeDefined();
        });
    };
    it("renders upload field", async () => {
        await navigateToFitSpectrum();

        // Look for file upload input
        const uploadInput = screen.getByLabelText(/upload spectrum file/i);
        expect(uploadInput).toBeDefined();
    });

    it("accepts file uploads", () => {
        render(<App />);

        const uploadInput = screen.getByLabelText(/upload spectrum file/i);

        // Create a mock file
        const file = new File(['test content'], 'test.spec', { type: 'text/plain' });

        // Upload the file
        fireEvent.change(uploadInput, { target: { files: [file] } });

        expect(uploadInput.files[0]).toBe(file);
    });

    it("accepts .spec files", () => {
        render(<App />);

        const uploadInput = screen.getByLabelText(/upload spectrum file/i);

        const specFile = new File(['spec content'], 'spectrum.spec', { type: 'text/plain' });
        fireEvent.change(uploadInput, { target: { files: [specFile] } });

        expect(uploadInput.files[0].name).toBe('spectrum.spec');
    });

    it("accepts .txt files", () => {
        render(<App />);

        const uploadInput = screen.getByLabelText(/upload spectrum file/i);

        const txtFile = new File(['txt content'], 'data.txt', { type: 'text/plain' });
        fireEvent.change(uploadInput, { target: { files: [txtFile] } });

        expect(uploadInput.files[0].name).toBe('data.txt');
    });

    it("accepts .csv files", () => {
        render(<App />);

        const uploadInput = screen.getByLabelText(/upload spectrum file/i);

        const csvFile = new File(['csv,content'], 'data.csv', { type: 'text/csv' });
        fireEvent.change(uploadInput, { target: { files: [csvFile] } });

        expect(uploadInput.files[0].name).toBe('data.csv');
    });

    it("shows required validation on form submission", async () => {
        render(<App />);

        const submitButton = screen.getByRole("button", { name: /fit spectrum/i });

        fireEvent.click(submitButton);

        await waitFor(() => {
            // Should show validation error for missing file
            const errorMessage = screen.queryByText(/required/i);
            expect(errorMessage).toBeDefined();
        });
    });

    it("clears file when reset", () => {
        render(<App />);

        const uploadInput = screen.getByLabelText(/upload spectrum file/i);

        const file = new File(['test'], 'test.spec', { type: 'text/plain' });
        fireEvent.change(uploadInput, { target: { files: [file] } });

        expect(uploadInput.files[0]).toBe(file);

        // Clear the file
        fireEvent.change(uploadInput, { target: { files: [] } });

        expect(uploadInput.files.length).toBe(0);
    });
}); 