import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

function jsonResponse(data, ok = true) {
  return Promise.resolve({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("loads default listings on mount and renders them in compact cards", async () => {
    fetch.mockImplementation(() =>
      jsonResponse({
        listings: [
          {
            id: 1,
            title: "Default Seattle Stay",
            location: "Seattle",
            bedrooms: 1,
            bathrooms: 1,
            price: 120,
          },
        ],
      })
    );

    render(<App />);

    expect(screen.getByText("Loading Seattle stays…")).toBeInTheDocument();
    expect(await screen.findByText("Default Seattle Stay")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/ai/search",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ query: "Seattle" }),
      })
    );
  });

  it("submits a search and shows returned listings with quiet scores", async () => {
    const user = userEvent.setup();
    fetch
      .mockImplementationOnce(() =>
        jsonResponse({
          listings: [
            {
              id: 1,
              title: "Default Seattle Stay",
              location: "Seattle",
              bedrooms: 1,
              bathrooms: 1,
              price: 120,
            },
          ],
        })
      )
      .mockImplementationOnce(() =>
        jsonResponse({
          listings: [
            {
              id: 2,
              title: "Quiet Cottage",
              location: "Seattle",
              bedrooms: 2,
              bathrooms: 1,
              price: 180,
              quietScore: 9.246,
              reviewCount: 4,
            },
          ],
          showQuietScore: true,
          filters: {
            location: "Seattle",
            bedrooms: 2,
            exactBedrooms: false,
            bathrooms: null,
            exactBathrooms: null,
            hasBackyard: null,
            minQuietScore: 8,
            minPrice: null,
            maxPrice: 200,
          },
        })
      );

    render(<App />);

    await screen.findByText("Default Seattle Stay");
    await user.type(
      screen.getByPlaceholderText("Ask for a quiet place in Seattle..."),
      "quiet place in Seattle"
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByText("Quiet Cottage")).toBeInTheDocument();
    expect(screen.getByText("Quiet Score: 9.25 (4)")).toBeInTheDocument();
    expect(
      screen.getByText(
        'Based on your search for "quiet place in Seattle", we found 1 listing that match your needs.'
      )
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "/api/ai/search",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ query: "quiet place in Seattle" }),
      })
    );
  });

  it("shows the invalid query message when the backend rejects a search", async () => {
    const user = userEvent.setup();
    fetch
      .mockImplementationOnce(() => jsonResponse({ listings: [] }))
      .mockImplementationOnce(() =>
        jsonResponse({
          listings: [],
          invalidQuery: true,
          message: "Please ask about a stay, location, or budget.",
          showQuietScore: false,
          filters: {
            location: null,
            bedrooms: null,
            exactBedrooms: null,
            bathrooms: null,
            exactBathrooms: null,
            hasBackyard: null,
            minQuietScore: null,
            minPrice: null,
            maxPrice: null,
          },
        })
      );

    render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await user.type(
      screen.getByPlaceholderText("Ask for a quiet place in Seattle..."),
      "hello"
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(
      await screen.findByText("Please ask about a stay, location, or budget.")
    ).toBeInTheDocument();
    expect(screen.getByText("Filters applied")).toBeInTheDocument();
  });
});
