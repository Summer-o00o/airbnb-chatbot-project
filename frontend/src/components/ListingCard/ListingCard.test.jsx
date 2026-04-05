import { render, screen } from "@testing-library/react";
import ListingCard from "./ListingCard";

describe("ListingCard", () => {
  const listing = {
    id: 7,
    title: "Quiet Cottage",
    location: "Seattle",
    bedrooms: 2,
    bathrooms: 2,
    price: 180,
    quietScore: 9.246,
    reviewCount: 4,
  };

  it("renders formatted listing details and quiet score when requested", () => {
    render(<ListingCard listing={listing} showQuietScore />);

    expect(screen.getByRole("img", { name: "Quiet Cottage" })).toHaveAttribute(
      "src",
      expect.stringContaining("random=7")
    );
    expect(screen.getByText("Seattle")).toBeInTheDocument();
    expect(screen.getByText("2 bedrooms · 2 baths")).toBeInTheDocument();
    expect(screen.getByText("Quiet Score: 9.25 (4)")).toBeInTheDocument();
    expect(screen.getByText("$180 / night")).toBeInTheDocument();
  });

  it("hides extra metadata in compact mode", () => {
    render(<ListingCard listing={listing} compact showQuietScore />);

    expect(screen.getByText("Quiet Cottage")).toBeInTheDocument();
    expect(screen.queryByText("Seattle")).not.toBeInTheDocument();
    expect(screen.queryByText(/Quiet Score:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\$180 \/ night/)).not.toBeInTheDocument();
  });
});
