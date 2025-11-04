import React, { useEffect, useState } from "react";

export default function FoundMissing() {
  const [tab, setTab] = useState("found"); // "found" or "missing"
  const [foundList, setFoundList] = useState([]);
  const [missingList, setMissingList] = useState([]);
  const [loading, setLoading] = useState({ found: true, missing: true });
  const [error, setError] = useState(null);

  useEffect(() => {
    const base = "http://localhost:5000"; // change if your backend runs elsewhere

    const fetchList = async (path, setter, key) => {
      try {
        const res = await fetch(`${base}${path}`);
        if (!res.ok) throw new Error(`Failed to fetch ${key}`);
        const data = await res.json();
        setter(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Fetch error");
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    };

    fetchList("/api/found", setFoundList, "found");
    fetchList("/api/missing", setMissingList, "missing");
  }, []);

  const renderRecord = (p) => (
    <li key={p._id || p.id} className="record-item" style={{ marginBottom: 12 }}>
      <strong>{p.name || "Unknown"}</strong>
      {p.photo && (
        <div style={{ marginTop: 6 }}>
          <img src={p.photo} alt={p.name || ""} style={{ maxWidth: 200, height: "auto" }} />
        </div>
      )}
      {p.description && <div style={{ marginTop: 6 }}>{p.description}</div>}
    </li>
  );

  const activeList = tab === "found" ? foundList : missingList;
  const isLoading = tab === "found" ? loading.found : loading.missing;

  return (
    <div className="found-missing-page" style={{ padding: 16 }}>
      <h1>Found & Missing</h1>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setTab("found")}
          style={{
            marginRight: 8,
            padding: "8px 12px",
            background: tab === "found" ? "#0d6efd" : "#e9ecef",
            color: tab === "found" ? "#fff" : "#000",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Found
        </button>

        <button
          onClick={() => setTab("missing")}
          style={{
            padding: "8px 12px",
            background: tab === "missing" ? "#0d6efd" : "#e9ecef",
            color: tab === "missing" ? "#fff" : "#000",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Missing
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: 12 }}>Error: {error}</div>}

      {isLoading ? (
        <div>Loading {tab} persons...</div>
      ) : activeList.length === 0 ? (
        <div>No {tab} persons available.</div>
      ) : (
        <ul className="records-list" style={{ listStyle: "none", padding: 0 }}>
          {activeList.map(renderRecord)}
        </ul>
      )}
    </div>
  );
}