/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../../App";
describe("testing pathLength field ", () => {
  test("testing pathLength field render with defaultValue and perfectly visible", () => {
    render(<App />);
    const input = screen.getByLabelText("Path Length");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(1);
  });
  test(" test pathLength field render with user* given value and perfectly visible", () => {
    render(<App />);
    const input = screen.getByLabelText("Path Length");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
    fireEvent.input(input, {
      target: { value: 100 },
    });
    expect(input).toHaveValue(100);
  });
  test("testing pathLength field validation for out of range values", async () => {
    render(<App />);
    const input = screen.getByLabelText("Path Length");
    const button = screen.getByRole("button", {
      name: /new plot/i,
    });
    fireEvent.input(input, {
      target: { value: -1 },
    });
    user.click(button);
    await waitFor(async () => {
      expect(
        screen.getByText("Path length cannot be negative")
      ).toBeInTheDocument();
    });
  });
  test("testing pressure field validation for undefined values", async () => {
    render(<App />);
    const input = screen.getByLabelText("Path Length");
    const button = screen.getByRole("button", {
      name: /new plot/i,
    });
    user.clear(input);
    user.click(button);
    await waitFor(async () => {
      expect(
        screen.getByText("Path length must be defined")
      ).toBeInTheDocument();
    });
  });
});
