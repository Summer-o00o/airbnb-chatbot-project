import { useState, useEffect } from "react";

const API_BASE = "/api";

function ListingSkeleton({ count = 8, columns = 4, showSubtext = false }) {
  return (
    <div
      style={{
        maxWidth: "1600px",
        width: "85%",
        margin: "40px auto",
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "16px",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div
            className="skeleton"
            style={{
              width: "100%",
              height: "200px",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          />
          <div
            className="skeleton"
            style={{
              height: "18px",
              width: "85%",
              marginBottom: "8px",
            }}
          />
          {showSubtext && (
            <>
              <div
                className="skeleton"
                style={{
                  height: "14px",
                  width: "60%",
                  marginBottom: "6px",
                }}
              />
              <div
                className="skeleton"
                style={{
                  height: "14px",
                  width: "45%",
                  marginBottom: "6px",
                }}
              />
              <div
                className="skeleton"
                style={{
                  height: "16px",
                  width: "35%",
                  marginTop: "8px",
                }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

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
    setHasSearched(true);
    setLastSearchedQuery(query);
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
         // Persist the exact filters the AI interpreted for this search
        setAiFilters(data?.filters ?? null);
      })
      .catch((err) => {
        console.error("[Search]", err);
        setInvalidQueryMessage(err.message || "Search failed. Check console and backend logs.");
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1 onClick={goHome} style={{ cursor: "pointer" }}>
          Airbnb AI
        </h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
              e.preventDefault();
              if (!isSearching) handleSearch();
            }
          }}
          placeholder="Ask for a quiet place in Seattle..."
          style={{
            width: "500px",
            padding: "15px",
            fontSize: "16px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginTop: "16px",
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ff5a5f",
            color: "white",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {!hasSearched && isLoadingDefault && (
        <>
          <div style={{ marginTop: "8px", marginBottom: "-24px", textAlign: "center" }}>
<p className="loading-hint">Loading Seattle stays…</p>
          </div>
          <ListingSkeleton count={8} columns={4} />
        </>
      )}
      {!hasSearched && !isLoadingDefault && defaultListings.length > 0 && (
        <div
          style={{
            maxWidth: "1600px",
            width: "85%",
            margin: "40px auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {defaultListings.map((listing) => (
            <div
              key={listing.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "left",
              }}
            >
              <img
                src={`https://picsum.photos/400/250?random=${listing.id}`}
                alt={listing.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              />
              <h3 style={{ margin: 0, fontSize: "1rem" }}>{listing.title}</h3>
            </div>
          ))}
        </div>
      )}

      {hasSearched && isSearching && (
        <>
          <div style={{ marginTop: "8px", marginBottom: "-24px", textAlign: "center" }}>
            <p className="loading-hint">Finding stays for you…</p>
          </div>
          <ListingSkeleton count={6} columns={2} showSubtext />
        </>
      )}

      {hasSearched && !isSearching && listings.length === 0 && (
        <div
          style={{
            maxWidth: "1600px",
            width: "85%",
            margin: "40px auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <div style={{ maxWidth: "520px", width: "100%" }}>
            <div
              style={{
                position: "relative",
                padding: "20px 22px",
                borderRadius: "20px",
                background:
                  "radial-gradient(circle at top left, rgba(59,130,246,0.20), transparent 55%), radial-gradient(circle at bottom right, rgba(236,72,153,0.18), transparent 55%), rgba(15,23,42,0.96)",
                border: "1px solid rgba(148,163,184,0.55)",
                boxShadow:
                  "0 18px 45px rgba(15,23,42,0.75), 0 0 0 1px rgba(30,64,175,0.45)",
                color: "#e5e7eb",
                overflow: "hidden",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.15,
                  backgroundImage:
                    "linear-gradient(120deg, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(0deg, rgba(148,163,184,0.25) 1px, transparent 1px)",
                  backgroundSize: "26px 26px",
                  mixBlendMode: "soft-light",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#e5e7eb",
                    }}
                  >
                    AI Summary
                  </h3>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "3px 9px",
                      borderRadius: "999px",
                      border: "1px solid rgba(148,163,184,0.6)",
                      background:
                        "linear-gradient(120deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
                      color: "#c4d3ff",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Powered by AI
                  </span>
                </div>
                <p
                  style={{
                    marginTop: "6px",
                    marginBottom: aiFilters ? "10px" : "0",
                    fontSize: "0.9rem",
                    lineHeight: 1.55,
                    color: "#e5e7eb",
                  }}
                >
                  {invalidQueryMessage
                    ? invalidQueryMessage
                    : lastSearchedQuery.trim()
                    ? `No listings match your search for "${lastSearchedQuery.trim()}". Try different criteria or broaden your search.`
                    : "No listings found. Try adjusting your search."}
                </p>
                {aiFilters && (
                  <>
                    <div
                      style={{
                        height: "1px",
                        margin: "12px 0 10px",
                        background:
                          "linear-gradient(90deg, transparent, rgba(148,163,184,0.75), transparent)",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "0.78rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: "#9ca3af",
                        marginBottom: "6px",
                      }}
                    >
                      Filters applied
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        fontSize: "0.86rem",
                      }}
                    >
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Location</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.location && aiFilters.location.trim()
                            ? aiFilters.location
                            : "Any"}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Bedrooms</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.bedrooms == null
                            ? "Any"
                            : aiFilters.exactBedrooms
                            ? `Exactly ${aiFilters.bedrooms}`
                            : `At least ${aiFilters.bedrooms}`}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Bathrooms</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.bathrooms == null
                            ? "Any"
                            : aiFilters.exactBathrooms
                            ? `Exactly ${aiFilters.bathrooms}`
                            : `At least ${aiFilters.bathrooms}`}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Backyard</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.hasBackyard == null
                            ? "Any"
                            : aiFilters.hasBackyard
                            ? "Must have a backyard"
                            : "Backyard not required"}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Quiet</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.minQuietScore == null
                            ? "Any"
                            : `Quiet score \u2265 ${aiFilters.minQuietScore}`}
                        </span>
                      </li>
                      <li>
                        <span style={{ color: "#9ca3af" }}>Price</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.minPrice == null &&
                          aiFilters.maxPrice == null
                            ? "Any"
                            : aiFilters.minPrice != null &&
                              aiFilters.maxPrice != null
                            ? `$${aiFilters.minPrice} - $${aiFilters.maxPrice} / night`
                            : aiFilters.minPrice != null
                            ? `From $${aiFilters.minPrice} / night`
                            : `Up to $${aiFilters.maxPrice} / night`}
                        </span>
                      </li>
                    </ul>
                  </>
                )}
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                  }}
                >
                  This panel reflects how the AI interpreted your natural
                  language query and translated it into listing filters.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {listings.length > 0 && (
        <div
          style={{
            maxWidth: "1600px",
            width: "85%",
            margin: "40px auto",
            display: "flex",
            gap: "40px",
          }}
        >
          <div
            style={{
              width: "70%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {listings.map((listing) => (
              <div
                key={listing.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "left",
                }}
              >
                <img
                  src={`https://picsum.photos/400/250?random=${listing.id}`}
                  alt={listing.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                />
                <h3>{listing.title}</h3>
                <p>{listing.location}</p>
                <p>
                  {listing.bedrooms ?? 0} bedrooms · {listing.bathrooms ?? 0}{" "}
                  {listing.bathrooms > 1 ? "baths" : "bath"}
                </p>
                {showQuietScore && (
                  <p>
                    Quiet Score:{" "}
                    {listing.quietScore != null
                      ? Number(listing.quietScore).toFixed(2)
                      : "No reviews"}{" "}
                    ({listing.reviewCount ?? 0})
                  </p>
                )}
                <p style={{ fontWeight: "bold" }}>${listing.price} / night</p>
              </div>
            ))}
          </div>
          <div style={{ width: "30%" }}>
            <div
              style={{
                position: "sticky",
                top: "96px",
                padding: "18px 18px 16px",
                borderRadius: "18px",
                background:
                  "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(236,72,153,0.16), transparent 55%), rgba(15,23,42,0.96)",
                border: "1px solid rgba(148,163,184,0.5)",
                boxShadow:
                  "0 14px 38px rgba(15,23,42,0.78), 0 0 0 1px rgba(30,64,175,0.55)",
                color: "#e5e7eb",
                overflow: "hidden",
                backdropFilter: "blur(18px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.14,
                  backgroundImage:
                    "linear-gradient(120deg, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(0deg, rgba(148,163,184,0.25) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                  mixBlendMode: "soft-light",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#e5e7eb",
                    }}
                  >
                    AI Summary
                  </h3>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      border: "1px solid rgba(148,163,184,0.6)",
                      background:
                        "linear-gradient(120deg, rgba(15,23,42,0.95), rgba(15,23,42,0.8))",
                      color: "#c4d3ff",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Powered by AI
                  </span>
                </div>
                <p
                  style={{
                    marginTop: "4px",
                    marginBottom: aiFilters ? "10px" : "6px",
                    fontSize: "0.86rem",
                    lineHeight: 1.55,
                    color: "#e5e7eb",
                  }}
                >
                  {lastSearchedQuery.trim()
                    ? `Based on your search for "${lastSearchedQuery.trim()}", we found ${listings.length} ${
                        listings.length === 1 ? "listing" : "listings"
                      } that match your needs.`
                    : `We found ${listings.length} ${
                        listings.length === 1 ? "listing" : "listings"
                      } for you.`}
                </p>
                {aiFilters && (
                  <>
                    <div
                      style={{
                        height: "1px",
                        margin: "10px 0 8px",
                        background:
                          "linear-gradient(90deg, transparent, rgba(148,163,184,0.75), transparent)",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "0.76rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: "#9ca3af",
                        marginBottom: "6px",
                      }}
                    >
                      Filters applied
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        fontSize: "0.84rem",
                      }}
                    >
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Location</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.location && aiFilters.location.trim()
                            ? aiFilters.location
                            : "Any"}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Bedrooms</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.bedrooms == null
                            ? "Any"
                            : aiFilters.exactBedrooms
                            ? `Exactly ${aiFilters.bedrooms}`
                            : `At least ${aiFilters.bedrooms}`}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Bathrooms</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.bathrooms == null
                            ? "Any"
                            : aiFilters.exactBathrooms
                            ? `Exactly ${aiFilters.bathrooms}`
                            : `At least ${aiFilters.bathrooms}`}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Backyard</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.hasBackyard == null
                            ? "Any"
                            : aiFilters.hasBackyard
                            ? "Must have a backyard"
                            : "Backyard not required"}
                        </span>
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <span style={{ color: "#9ca3af" }}>Quiet</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.minQuietScore == null
                            ? "Any"
                            : `Quiet score \u2265 ${aiFilters.minQuietScore}`}
                        </span>
                      </li>
                      <li>
                        <span style={{ color: "#9ca3af" }}>Price</span>:{" "}
                        <span style={{ color: "#e5e7eb" }}>
                          {aiFilters.minPrice == null &&
                          aiFilters.maxPrice == null
                            ? "Any"
                            : aiFilters.minPrice != null &&
                              aiFilters.maxPrice != null
                            ? `$${aiFilters.minPrice} - $${aiFilters.maxPrice} / night`
                            : aiFilters.minPrice != null
                            ? `From $${aiFilters.minPrice} / night`
                            : `Up to $${aiFilters.maxPrice} / night`}
                        </span>
                      </li>
                    </ul>
                  </>
                )}
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "0.72rem",
                    color: "#9ca3af",
                  }}
                >
                  The AI reads your freeform request, extracts filters, and
                  applies them to the listing results shown on the left.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
