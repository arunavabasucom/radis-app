import { render, screen, fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import FitLogsModal from "../../../src/components/FitLogs";

describe("FitLogsModal Component", () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        fitVals: [
            [1.0, 2.0, 3.0],
            [1.1, 2.1, 3.1],
            [1.2, 2.2, 3.2]
        ],
        paramNames: ["Temperature", "Pressure", "Concentration"]
    };

    it("renders the modal when isOpen is true", () => {
        render(<FitLogsModal {...defaultProps} />);

        expect(screen.getByText("Fit Logs")).toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
        render(<FitLogsModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByText("Fit Logs")).not.toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("displays the correct header with custom parameter names", () => {
        render(<FitLogsModal {...defaultProps} />);

        expect(screen.getByText("Iteration")).toBeInTheDocument();
        expect(screen.getByText("Temperature")).toBeInTheDocument();
        expect(screen.getByText("Pressure")).toBeInTheDocument();
        expect(screen.getByText("Concentration")).toBeInTheDocument();
    });

    it("displays default parameter names when paramNames is not provided", () => {
        const propsWithoutParamNames = {
            ...defaultProps,
            paramNames: undefined
        };
        render(<FitLogsModal {...propsWithoutParamNames} />);

        expect(screen.getByText("Param 1")).toBeInTheDocument();
        expect(screen.getByText("Param 2")).toBeInTheDocument();
        expect(screen.getByText("Param 3")).toBeInTheDocument();
    });

    it("displays all fit values in the table", () => {
        render(<FitLogsModal {...defaultProps} />);

        // Check iteration numbers
        expect(screen.getByText("0")).toBeInTheDocument();
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();

        // Check some of the fit values (formatted to 6 decimal places)
        expect(screen.getByText("1.000000")).toBeInTheDocument();
        expect(screen.getByText("2.000000")).toBeInTheDocument();
        expect(screen.getByText("3.000000")).toBeInTheDocument();
        expect(screen.getByText("1.100000")).toBeInTheDocument();
        expect(screen.getByText("2.100000")).toBeInTheDocument();
        expect(screen.getByText("3.100000")).toBeInTheDocument();
    });

    it("handles empty fitVals array", () => {
        const propsWithEmptyFitVals = {
            ...defaultProps,
            fitVals: []
        };
        render(<FitLogsModal {...propsWithEmptyFitVals} />);

        expect(screen.getByText("Fit Logs")).toBeInTheDocument();
        expect(screen.getByText("Iteration")).toBeInTheDocument();
        // Should not crash with empty data
    });

    it("handles fitVals with different array lengths", () => {
        const propsWithVaryingLengths = {
            ...defaultProps,
            fitVals: [
                [1.0, 2.0],
                [1.1, 2.1, 3.1],
                [1.2]
            ]
        };
        render(<FitLogsModal {...propsWithVaryingLengths} />);

        expect(screen.getByText("Fit Logs")).toBeInTheDocument();
        // Should handle varying array lengths gracefully
    });

    it("calls onClose when close button is clicked", async () => {
        const onCloseMock = vi.fn();
        render(<FitLogsModal {...defaultProps} onClose={onCloseMock} />);

        const closeButton = screen.getByRole("button", { name: /close/i });
        await user.click(closeButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("doesn't call onClose when clicking outside the modal", async () => {
        const onCloseMock = vi.fn();
        render(<FitLogsModal {...defaultProps} onClose={onCloseMock} />);

        // Click on the backdrop (modal overlay)
        const backdrop = screen.getByRole("presentation");
        await user.click(backdrop);

        expect(onCloseMock).toHaveBeenCalledTimes(0);
    });

    it("displays correct number of columns based on fitVals", () => {
        const propsWithMoreParams = {
            ...defaultProps,
            fitVals: [
                [1.0, 2.0, 3.0, 4.0, 5.0],
                [1.1, 2.1, 3.1, 4.1, 5.1]
            ],
            paramNames: ["A", "B", "C", "D", "E"]
        };
        render(<FitLogsModal {...propsWithMoreParams} />);

        expect(screen.getByText("A")).toBeInTheDocument();
        expect(screen.getByText("B")).toBeInTheDocument();
        expect(screen.getByText("C")).toBeInTheDocument();
        expect(screen.getByText("D")).toBeInTheDocument();
        expect(screen.getByText("E")).toBeInTheDocument();
    });

    it("formats decimal values correctly", () => {
        const propsWithDecimals = {
            ...defaultProps,
            fitVals: [
                [1.123456789, 2.987654321],
                [3.141592, 2.718281]
            ]
        };
        render(<FitLogsModal {...propsWithDecimals} />);

        // Should format to 6 decimal places
        expect(screen.getByText("1.123457")).toBeInTheDocument();
        expect(screen.getByText("2.987654")).toBeInTheDocument();
        expect(screen.getByText("3.141592")).toBeInTheDocument();
        expect(screen.getByText("2.718281")).toBeInTheDocument();
    });

    it("handles negative values correctly", () => {
        const propsWithNegatives = {
            ...defaultProps,
            fitVals: [
                [-1.5, 2.0, -3.7],
                [0.0, -2.1, 3.2]
            ]
        };
        render(<FitLogsModal {...propsWithNegatives} />);

        expect(screen.getByText("-1.500000")).toBeInTheDocument();
        expect(screen.getByText("-3.700000")).toBeInTheDocument();
        expect(screen.getByText("0.000000")).toBeInTheDocument();
        expect(screen.getByText("-2.100000")).toBeInTheDocument();
    });
}); 