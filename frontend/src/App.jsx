import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar/SearchBar";
import ListingCard from "./components/ListingCard/ListingCard";
import ListingSkeleton from "./components/ListingSkeleton/ListingSkeleton";
import AISummaryPanel from "./components/AISummaryPanel/AISummaryPanel";
import styles from "./App.module.css";

const API_BASE = "/api";

function App() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [defaultListings, setDefaultListings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");
  const [invalidQueryMessage, setInvalidQueryMessage] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showQuietScore, setShowQuietScore] = useState(false);
  const [isLoadingDefault, setIsLoadingDefault] = useState(true);
  const [aiFilters, setAiFilters] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/ai/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Seattle" }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error("[Default listings] API error", res.status, text);
            throw new Error(`${res.status}: ${text.slice(0, 200)}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.listings ?? []);
        setDefaultListings(list.slice(0, 8));
      })
      .catch((err) => {
        console.error("[Default listings]", err);
        setDefaultListings([]);
      })
      .finally(() => setIsLoadingDefault(false));
  }, []);

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setHasSearched(false);
      setLastSearchedQuery("");
      setInvalidQueryMessage(null);
      setListings([]);
      setAiFilters(null);
      return;
    }

    setHasSearched(true);
    setLastSearchedQuery(trimmedQuery);
    setInvalidQueryMessage(null);
    setListings([]);
    setAiFilters(null);
    setIsSearching(true);
    fetch(`${API_BASE}/ai/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error("[Search] API error", res.status, text);
            throw new Error(`${res.status}: ${text.slice(0, 200)}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.listings ?? []);
        setListings(list);
        if (data?.invalidQuery && data?.message) {
          setInvalidQueryMessage(data.message);
        }
        setShowQuietScore(Boolean(data?.showQuietScore));
        setAiFilters(data?.filters ?? null);
      })
      .catch((err) => {
        console.error("[Search]", err);
        setInvalidQueryMessage(
          err.message || "Search failed. Check console and backend logs."
        );
      })
      .finally(() => setIsSearching(false));
  };

  const goHome = () => {
    setListings([]);
    setQuery("");
    setHasSearched(false);
    setInvalidQueryMessage(null);
    setAiFilters(null);
  };

  return (
    <div className={styles.app}>
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        onTitleClick={goHome}
        isSearching={isSearching}
      />

      {!hasSearched && isLoadingDefault && (
        <>
          <div className={styles.loadingHint}>
            <p>Loading Seattle stays…</p>
          </div>
          <ListingSkeleton count={8} columns={4} />
        </>
      )}

      {!hasSearched && !isLoadingDefault && defaultListings.length > 0 && (
        <div className={styles.defaultListingsGrid}>
          {defaultListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} compact />
          ))}
        </div>
      )}

      {hasSearched && isSearching && (
        <>
          <div className={styles.loadingHint}>
            <p>Finding stays for you…</p>
          </div>
          <ListingSkeleton count={6} columns={2} showSubtext />
        </>
      )}

      {hasSearched && !isSearching && listings.length === 0 && (
        <div className={styles.emptyStateWrapper}>
          <div className={styles.emptyStateInner}>
            <AISummaryPanel
              message={
                invalidQueryMessage
                  ? invalidQueryMessage
                  : lastSearchedQuery.trim()
                    ? `No listings match your search for "${lastSearchedQuery.trim()}". Try different criteria or broaden your search.`
                    : "No listings found. Try adjusting your search."
              }
              aiFilters={aiFilters}
              footerText="This panel reflects how the AI interpreted your natural language query and translated it into listing filters."
              variant="card"
            />
          </div>
        </div>
      )}

      {listings.length > 0 && (
        <div className={styles.resultsLayout}>
          <div className={styles.resultsGrid}>
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showQuietScore={showQuietScore}
              />
            ))}
          </div>
          <div className={styles.sidebar}>
            <AISummaryPanel
              message={
                lastSearchedQuery.trim()
                  ? `Based on your search for "${lastSearchedQuery.trim()}", we found ${listings.length} ${listings.length === 1 ? "listing" : "listings"} that match your needs.`
                  : `We found ${listings.length} ${listings.length === 1 ? "listing" : "listings"} for you.`
              }
              aiFilters={aiFilters}
              footerText="The AI reads your freeform request, extracts filters, and applies them to the listing results shown on the left."
              variant="sidebar"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
