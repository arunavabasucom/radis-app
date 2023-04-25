/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../../app/App";
describe("testing pressure field ", () => {
  test("testing pressure field render with defaultValue and perfectly visible", () => {
    render(<App />);
    const input = screen.getByLabelText("Pressure");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(1.01325);
  });
  test(" test pressure field render with user* given value and perfectly visible", () => {
    render(<App />);
    const input = screen.getByLabelText("Pressure");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
    fireEvent.input(input, {
      target: { value: 100 },
    });
    expect(input).toHaveValue(100);
  });
  test("testing pressure field validation for out of range values", async () => {
    render(<App />);
    const input = screen.getByLabelText("Pressure");
    const button = screen.getByRole("button", {
      name: /new plot/i,
    });
    fireEvent.input(input, {
      target: { value: -1 },
    });
    user.click(button);
    await waitFor(async () => {
      expect(
        screen.getByText("Pressure cannot be negative")
      ).toBeInTheDocument();
    });
  });
  test("testing pressure field validation for undefined values", async () => {
    render(<App />);
    const input = screen.getByLabelText("Pressure");
    const button = screen.getByRole("button", {
      name: /new plot/i,
    });
    user.clear(input);
    user.click(button);
    await waitFor(async () => {
      expect(screen.getByText("Pressure must be defined")).toBeInTheDocument();
    });
  });
});
