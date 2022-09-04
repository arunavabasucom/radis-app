/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../../App";
describe("testing:integration radis app ", () => {
  test("testing : when mode is  absorbance*  the simulate slit switch is not in  the DOM", () => {
    render(<App />);
    const button = screen.queryByTestId("slit-switch-testid");
    expect(button).not.toBeInTheDocument();
  });
  test("testing : when mode is  radiance*  the simulate slit switch is in the DOM", () => {
    render(<App />);
    const dropdown = screen.getByTestId("mode-testid");
    fireEvent.change(dropdown, { target: { value: "radiance_noslit" } });
    const button = screen.getByTestId("slit-switch-testid");
    expect(button).toBeInTheDocument();
  });
  test("testing : when mode is  transmittance*  the simulate slit switch is in the DOM", () => {
    render(<App />);
    const dropdown = screen.getByTestId("mode-testid");
    fireEvent.change(dropdown, { target: { value: "transmittance_noslit" } });
    const button = screen.getByTestId("slit-switch-testid");
    expect(button).toBeInTheDocument();
  });
});
