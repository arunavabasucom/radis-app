import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(`${import.meta.env.VITE_API_ENDPOINT}calculate-spectrum`, () => {
    return HttpResponse.json({
      data: {}
    });
  }),
  http.post(`${import.meta.env.VITE_API_ENDPOINT}download-txt`, async () => {
    const fileContent = "This is a test file."; // Simulated file content
    const blob = new Blob([fileContent], {
      type: "application/octet-stream",
    });

    return new HttpResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=mock-file.csv",
      },
    });
  }),
];
