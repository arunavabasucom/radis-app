// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
window.URL.createObjectURL = () => "";
import { server } from "./mocks/server";
beforeAll(() => {
  server.listen();
  server.events.on("request:unhandled", (req) => {
    console.warn("Unhandled Request:", req.request.method, req.request.url);
  });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
