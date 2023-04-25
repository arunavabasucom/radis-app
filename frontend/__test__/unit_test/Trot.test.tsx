/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/react-in-jsx-scope */
import { fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../../app/App";

describe("testing trot field ", () => {
  test("testing trot rendered but not visible if non-equilibrium-switch* is not checked", () => {
    render(<App />);
    const input = screen.queryByTestId("trot-testid");
    expect(input).not.toBeInTheDocument();
  });

  test("testing trot rendered and visible if non-equilibrium-switch* is checked", async () => {
    render(<App />);
    const button = screen.getByTestId("non-equilibrium-switch-testid");
    user.click(button);
    // Use `waitFor` to wait for the input element to appear
    const input = await screen.findByTestId("trot-testid");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
  });

  test("testing trot rendering with defaultValue if non-equilibrium-switch* is checked", async () => {
    render(<App />);
    const button = screen.getByTestId("non-equilibrium-switch-testid");
    user.click(button);
  
    // Use `waitFor` to wait for the input element to appear
    const input = await screen.findByTestId("trot-testid");
  
    expect(input).toHaveAttribute("value", "300");
  });

  test("testing trot rendered with user* given value if non-equilibrium-switch* is checked", async () => {
    render(<App />);
    const button = screen.getByTestId("non-equilibrium-switch-testid");
    user.click(button);

    // Use `waitFor` to wait for the input element to appear
    const input = await screen.findByTestId("trot-testid");
    fireEvent.input(input, { target: { value: 100 } });

    expect(input).toHaveValue(100);
  });
});
