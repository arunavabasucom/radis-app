/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../../App";
describe("testing tvib field ", () => {
  test("testing tvib rendered but not visible if non-equilibrium-switch* is not checked", () => {
    render(<App />);
    const input = screen.queryByTestId("tvib-testid") as HTMLElement;
    expect(input).not.toBeInTheDocument();
  });
  test("testing tvib rendered and visible if non-equilibrium-switch* is checked", () => {
    render(<App />);
    const button = screen.getByTestId("equilibrium-switch-testid");
    user.click(button);
    const input = screen.queryByTestId("tvib-testid") as HTMLElement;
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
  });
  test("testing tvib rendering with defaultValue if non-equilibrium-switch* is checked", () => {
    render(<App />);
    const button = screen.getByTestId("equilibrium-switch-testid");
    user.click(button);
    const input = screen.queryByTestId("tvib-testid") as HTMLElement;
    expect(input).toHaveValue(300);
  });
  test("testing tvib rendered with user* given value if non-equilibrium-switch* is checked", () => {
    render(<App />);
    const button = screen.getByTestId("equilibrium-switch-testid");
    user.click(button);
    const input = screen.queryByTestId("tvib-testid") as HTMLElement;
    fireEvent.input(input, {
      target: { value: 100 },
    });
    expect(input).toHaveValue(100);
  });
});
