import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { DownloadSpecButton } from "../../../src/components/DownloadSpecButton";

describe("DownloadSpecButton Component", () => {
    it("renders download spectrum button", () => {
        render(<DownloadSpecButton disabled={false} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton).toBeDefined();
    });

    it("shows correct text", () => {
        render(<DownloadSpecButton disabled={false} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton.textContent).toContain("Download");
    });

    it("is disabled when disabled prop is true", () => {
        render(<DownloadSpecButton disabled={true} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton.disabled).toBe(true);
    });

    it("is enabled when disabled prop is false", () => {
        render(<DownloadSpecButton disabled={false} />);

        const downloadButton = screen.getByRole("button");
        expect(downloadButton.disabled).toBe(false);
    });

    it("is clickable when enabled", () => {
        render(<DownloadSpecButton disabled={false} />);

        const downloadButton = screen.getByRole("button");

        fireEvent.click(downloadButton);

        // Button should be clickable (no error thrown)
        expect(downloadButton).toBeDefined();
    });

    it("cannot be clicked when disabled", () => {
        render(<DownloadSpecButton disabled={true} />);

        const downloadButton = screen.getByRole("button");

        // Should not be able to click disabled button
        expect(downloadButton.disabled).toBe(true);
    });
}); 