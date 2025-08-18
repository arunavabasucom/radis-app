import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { DownloadTxtButton } from "../../../src/components/DownloadTxtButton";

describe("DownloadTxtButton Component", () => {
    it("renders download txt button", () => {
        render(<DownloadTxtButton disabled={false} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton).toBeDefined();
    });

    it("shows correct text", () => {
        render(<DownloadTxtButton disabled={false} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton.textContent).toContain("Download");
    });

    it("is disabled when disabled prop is true", () => {
        render(<DownloadTxtButton disabled={true} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton.disabled).toBe(true);
    });

    it("is enabled when disabled prop is false", () => {
        render(<DownloadTxtButton disabled={false} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton.disabled).toBe(false);
    });

    it("is clickable when enabled", () => {
        render(<DownloadTxtButton disabled={false} />);

        const downloadButton = screen.getByRole("button");

        fireEvent.click(downloadButton);

        // Button should be clickable (no error thrown)
        expect(downloadButton).toBeDefined();
    });

    it("cannot be clicked when disabled", () => {
        render(<DownloadTxtButton disabled={true} />);

        const downloadButton = screen.getByRole("button");

        // Should not be able to click disabled button
        expect(downloadButton.disabled).toBe(true);
    });
}); 