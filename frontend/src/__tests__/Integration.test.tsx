/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../App";
import { Database as TDatabase } from "../components/types";
describe("testing: rendering slit switch based on mode ", () => {
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
describe("testing: rendering non-equilibrium switch based on database ", () => {
  // test("testing : when database is  HITRAN*  the non-equilibrium switch is in the DOM", () => {
  //   render(<App />);
  //   const button = screen.getByTestId("non-equilibrium-switch-testid");
  //   const dropdown = screen.getByTestId("database-testid");
  //   fireEvent.change(dropdown, { target: { value: TDatabase.HITEMP } });
  //   expect(button).toBeInTheDocument();
  // });
  test("testing : when database is  GEISA*  the non-equilibrium switch is not in the DOM", () => {
    render(<App />);
    const button = screen.getByTestId("non-equilibrium-switch-testid");
    const dropdown = screen.getByTestId("database-testid");
    fireEvent.change(dropdown, { target: { value: TDatabase.GEISA } });
    expect(button).not.toBeInTheDocument();
  });
  // test("testing : when database is  HITEMP*  the non-equilibrium switch is in the DOM", () => {
  //   render(<App />);

  //   const dropdown = screen.getByTestId("database-testid");
  //   const button = screen.getByTestId("non-equilibrium-switch-testid");
  //   fireEvent.change(dropdown, { target: { value: TDatabase.HITEMP } });

  //   expect(button).toBeInTheDocument();
  // });
});
