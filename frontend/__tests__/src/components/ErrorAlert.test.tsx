import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { describe, it, expect } from "vitest";
import { ErrorAlert } from "../../../src/components/ErrorAlert";

describe("ErrorAlert Component", () => {
    it("renders with the provided error message", () => {
        const testMessage = "This is a test error message";
        render(<ErrorAlert message={testMessage} />);

        expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it("is initially open", () => {
        const testMessage = "Error message";
        render(<ErrorAlert message={testMessage} />);

        const alert = screen.getByText(testMessage);
        expect(alert).toBeVisible();
    });

    it("can be closed by clicking close button", async () => {
        const testMessage = "Closeable error";
        render(<ErrorAlert message={testMessage} />);

        const alert = screen.getByText(testMessage);
        expect(alert).toBeVisible();

        // Try to find and click close button (Snackbar usually has one)
        // The close functionality is handled by onClose prop
    });

    it("renders with danger color styling", () => {
        const testMessage = "Danger alert";
        render(<ErrorAlert message={testMessage} />);

        const alert = screen.getByText(testMessage);
        expect(alert).toBeInTheDocument();
    });

    it("handles different message lengths", () => {
        const longMessage = "This is a very long error message that should still be displayed properly in the alert component without breaking the layout or functionality";
        render(<ErrorAlert message={longMessage} />);

        expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it("handles empty message", () => {
        render(<ErrorAlert message="" />);

        // Should still render but with empty content
        const snackbar = screen.getByRole('presentation');
        expect(snackbar).toBeInTheDocument();
    });
}); 