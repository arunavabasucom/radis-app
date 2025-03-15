import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import App from "../../../../src/App";

describe("testing download-txt button", () => {
  test("should render on screen when app is loaded", () => {
    render(<App />);
    const downloadBtn = screen.getByTestId("download-txt-test");
    expect(downloadBtn).toBeInTheDocument();
  });

  test("should be disabled befor spectrum is generated", () => {
    render(<App />);
    const downloadBtn = screen.getByTestId("download-txt-test");
    expect(downloadBtn).toBeDisabled();
  });

  test("should be enabled after spectrum is generated", async () => {
    render(<App />);
    const newPlotBtn = screen.getByTestId("newPlot-test");
    fireEvent.click(newPlotBtn);
    await waitFor(() => {
      const downloadBtn = screen.getByTestId("download-txt-test");
      expect(downloadBtn).toBeEnabled();
    });
  });

  test("should download a file when clicked", async () => {
    render(<App/>)
    window.URL.createObjectURL = vi.fn(() => "mock-url");
    const newPlotBtn = screen.getByTestId("newPlot-test");
    fireEvent.click(newPlotBtn);
    await waitFor(async () => {
      const downloadBtn = screen.getByTestId("download-txt-test");
      fireEvent.click(downloadBtn);
      await waitFor(() => {
        expect(URL.createObjectURL).toHaveBeenCalled();
      });
    });
    vi.resetAllMocks();
  });
});
