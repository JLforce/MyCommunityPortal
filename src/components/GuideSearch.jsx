"use client"

import { useEffect, useState } from "react";

export default function GuideSearch({ items = [] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(items || []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!query) return setResults(items);
      const q = query.toLowerCase().trim();
      setResults(
        items.filter((it) => it.name.toLowerCase().includes(q) || (it.category || "").toLowerCase().includes(q))
      );
    }, 180);
    return () => clearTimeout(t);
  }, [query, items]);

  function jumpTo(target) {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setQuery("");
  }

  return (
    <div className="guide-search-component">
      <input
        id="guide-search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search waste items..."
        aria-label="Search waste items"
        className="search-input"
      />

      <button
        type="button"
        className="btn search-btn"
        onClick={(e) => {
          e.preventDefault();
          if (query && results[0]) jumpTo(results[0].target);
        }}
      >
        Search
      </button>

      {query ? (
        <div className="search-results" role="listbox" aria-label="Search results">
          {results.length ? (
            results.map((it, i) => (
              <button key={i} type="button" className="search-result" onClick={() => jumpTo(it.target)}>
                <div className="result-name">{it.name}</div>
                <div className="result-cat muted">{it.category}</div>
              </button>
            ))
          ) : (
            <div className="search-empty muted">No matches</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
