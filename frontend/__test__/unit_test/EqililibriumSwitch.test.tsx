/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { render, screen } from "@testing-library/react";
import App from "../../app/App";
describe("testing::equilibrium switch", () => {
  test("testing: equilibrium switch is in the DOM", () => {
    render(<App />);
    const button = screen.getByTestId("non-equilibrium-switch-testid");
    expect(button).toBeInTheDocument();
  });
  test("testing: equilibrium switch is not checked when app is rendered", () => {
    render(<App />);
    const button = screen.getByTestId("non-equilibrium-switch-testid");
    expect(button).toBeInTheDocument();
    expect(button).not.toBeChecked();
  });
});
