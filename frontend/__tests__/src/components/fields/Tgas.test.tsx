import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import React from "react";
import App from "../../../../src/App";
describe("testing tgas field ", () => {
  test("testing tgas field render with defaultValue and perfectly visible", () => {
    render(<App />);
    const input = screen.getByLabelText("TGas");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(300);
  });
  test("testing tgas field render with user* given value and perfectly visible", () => {
    render(<App />);
    const input = screen.getByLabelText("TGas");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
    fireEvent.input(input, {
      target: { value: 100 },
    });
    expect(input).toHaveValue(100);
  });
  test("testing tgas field validation for out of range values", async () => {
    render(<App />);
    const input = screen.getByLabelText("TGas");
    const button = screen.getByRole("button", {
      name: /new plot/i,
    });
    fireEvent.input(input, {
      target: { value: 20000000 },
    });
    user.click(button);
    await waitFor(async () => {
      expect(
        screen.getByText("Tgas must be between 1K and 9000K")
      ).toBeInTheDocument();
    });
  });
  test("testing tgas field validation for undefined fields", async () => {
    render(<App />);
    const input = screen.getByLabelText("TGas");
    const button = screen.getByRole("button", {
      name: /new plot/i,
    });
    user.clear(input);
    user.click(button);
    await waitFor(async () => {
      expect(screen.getByText("Tgas must be defined")).toBeInTheDocument();
    });
  });
});
