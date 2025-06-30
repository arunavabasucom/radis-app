import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import App from "../../../../src/App";
import useFromStore from "../../../../src/store/form";

beforeEach(() => {
  const { toggleIsNonEquilibrium } = useFromStore.getState();
  toggleIsNonEquilibrium(false);
});

describe("testing trot field ", () => {
  test("testing trot rendered but not visible if non-equilibrium-switch* is not checked", () => {
    render(<App />);
    const input = screen.queryByTestId("trot-testid") as HTMLElement;
    expect(input).not.toBeInTheDocument();
  });
  test("testing trot rendered and visible if non-equilibrium-switch* is checked", () => {
    render(<App />);

    const switchEl = screen.getByTestId("non-equilibrium-switch-testid");
    const inputElement = switchEl.querySelector("input");
    if (inputElement) {
      fireEvent.click(inputElement);
    }

    const input = screen.getByLabelText("Trot");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
  });
  test("testing trot rendering with defaultValue if non-equilibrium-switch* is checked", () => {
    render(<App />);

    const switchEl = screen.getByTestId("non-equilibrium-switch-testid");
    const inputElement = switchEl.querySelector("input");
    if (inputElement) {
      fireEvent.click(inputElement);
    }

    const input = screen.getByLabelText("Trot");
    expect(input).toHaveValue(300);
  });
  test("testing trot rendered with user* given value if non-equilibrium-switch* is checked", () => {
    render(<App />);

    const switchEl = screen.getByTestId("non-equilibrium-switch-testid");
    const inputElement = switchEl.querySelector("input");
    if (inputElement) {
      fireEvent.click(inputElement);
    }

    const input = screen.getByLabelText("Trot");
    fireEvent.input(input, {
      target: { value: 100 },
    });
    expect(input).toHaveValue(100);
  });
});
