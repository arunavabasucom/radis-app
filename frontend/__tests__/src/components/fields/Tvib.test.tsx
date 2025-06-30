import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, test, expect } from "vitest";
import App from "../../../../src/App";
import useFromStore from "../../../../src/store/form";

beforeEach(() => {
  const { toggleIsNonEquilibrium } = useFromStore.getState();
  toggleIsNonEquilibrium(false);
});

describe("testing tvib field ", () => {
  test("testing tvib rendered but not visible if non-equilibrium-switch* is not checked", () => {
    render(<App />);
    const input = screen.queryByTestId("tvib-testid");
    expect(input).not.toBeInTheDocument();
  });
  test("testing tvib rendered and visible if non-equilibrium-switch* is checked", () => {
    render(<App />);

    const switchEl = screen.getByTestId("non-equilibrium-switch-testid");
    const inputElement = switchEl.querySelector("input");
    if (inputElement) {
      fireEvent.click(inputElement);
    }

    const input = screen.getByLabelText("Tvib");
    expect(input).toBeVisible();
    expect(input).toBeInTheDocument();
  });
  test("testing tvib rendering with defaultValue if non-equilibrium-switch* is checked", () => {
    render(<App />);
    const switchEl = screen.getByTestId("non-equilibrium-switch-testid");
    const inputElement = switchEl.querySelector("input");
    if (inputElement) {
      fireEvent.click(inputElement);
    }

    const input = screen.getByLabelText("Tvib");
    expect(input).toBeVisible();
    expect(input).toHaveValue(300);
  });
  test("testing tvib rendered with user* given value if non-equilibrium-switch* is checked", () => {
    render(<App />);
    const switchEl = screen.getByTestId("non-equilibrium-switch-testid");
    const inputElement = switchEl.querySelector("input");
    if (inputElement) {
      fireEvent.click(inputElement);
    }
    const input = screen.getByLabelText("Tvib");
    fireEvent.input(input, {
      target: { value: 100 },
    });
    expect(input).toHaveValue(100);
  });
});
