import { render, screen } from "@testing-library/react";
import AISummaryPanel from "./AISummaryPanel";

describe("AISummaryPanel", () => {
  it("renders formatted filters for the interpreted AI search", () => {
    render(
      <AISummaryPanel
        message="We found a few matches."
        footerText="AI filters are shown here."
        aiFilters={{
          location: "Seattle",
          bedrooms: 2,
          exactBedrooms: false,
          bathrooms: 1,
          exactBathrooms: true,
          hasBackyard: true,
          minQuietScore: 8,
          minPrice: 100,
          maxPrice: 200,
        }}
        variant="sidebar"
      />
    );

    expect(screen.getByText("AI Summary")).toBeInTheDocument();
    expect(screen.getByText("Powered by AI")).toBeInTheDocument();
    expect(screen.getByText("Filters applied")).toBeInTheDocument();
    expect(screen.getByText("Seattle")).toBeInTheDocument();
    expect(screen.getByText("At least 2")).toBeInTheDocument();
    expect(screen.getByText("Exactly 1")).toBeInTheDocument();
    expect(screen.getByText("Must have a backyard")).toBeInTheDocument();
    expect(screen.getByText("Quiet score ≥ 8")).toBeInTheDocument();
    expect(screen.getByText("$100 - $200 / night")).toBeInTheDocument();
    expect(screen.getByText("AI filters are shown here.")).toBeInTheDocument();
  });

  it("falls back to Any labels when optional filters are absent", () => {
    render(
      <AISummaryPanel
        message="Nothing matched."
        aiFilters={{
          location: "",
          bedrooms: null,
          exactBedrooms: null,
          bathrooms: null,
          exactBathrooms: null,
          hasBackyard: null,
          minQuietScore: null,
          minPrice: null,
          maxPrice: null,
        }}
      />
    );

    expect(screen.getAllByText("Any")).toHaveLength(6);
  });
});
