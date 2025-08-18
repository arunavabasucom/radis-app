import { render, screen, waitFor } from '@testing-library/react';
import user from "@testing-library/user-event";
import React from 'react';
import { describe, it, expect } from 'vitest';
import App from "../../../src/App";

// skip this test cause it needs the backend to be running
describe.skip('PlotSpectra Component Integration Tests (skipped cause it fails on CI)', () => {
    it('should render the PlotSpectra component', async () => {
        render(<App />);

        const button = screen.getByRole("button", {
            name: /new plot/i,
        });
        user.click(button);
        await waitFor(() => {
            expect(screen.getByTestId('plot-testid')).toBeDefined();
        })
    });
});