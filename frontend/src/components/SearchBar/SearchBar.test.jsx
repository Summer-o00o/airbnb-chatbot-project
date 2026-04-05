import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("calls onSearch when Enter is pressed without modifiers", () => {
    const onSearch = vi.fn();

    render(
      <SearchBar
        value="Seattle"
        onChange={vi.fn()}
        onSearch={onSearch}
        onTitleClick={vi.fn()}
        isSearching={false}
      />
    );

    fireEvent.keyDown(
      screen.getByPlaceholderText("Ask for a quiet place in Seattle..."),
      { key: "Enter" }
    );

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("does not call onSearch when Enter has a modifier or a search is already running", () => {
    const onSearch = vi.fn();
    const { rerender } = render(
      <SearchBar
        value="Seattle"
        onChange={vi.fn()}
        onSearch={onSearch}
        onTitleClick={vi.fn()}
        isSearching={false}
      />
    );

    fireEvent.keyDown(
      screen.getByPlaceholderText("Ask for a quiet place in Seattle..."),
      { key: "Enter", metaKey: true }
    );

    rerender(
      <SearchBar
        value="Seattle"
        onChange={vi.fn()}
        onSearch={onSearch}
        onTitleClick={vi.fn()}
        isSearching
      />
    );

    fireEvent.keyDown(
      screen.getByPlaceholderText("Ask for a quiet place in Seattle..."),
      { key: "Enter" }
    );

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  });
});
