import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./FoundMissing.css";

export default function FoundMissing() {
  const [tab, setTab] = useState("missing"); // "found" or "missing"
  const [foundList, setFoundList] = useState([]);
  const [missingList, setMissingList] = useState([]);
  const [loading, setLoading] = useState({ found: true, missing: true });
  const [error, setError] = useState(null);

  const fetchData = () => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchList = async (status, setter, key) => {
      try {
        setLoading((prev) => ({ ...prev, [key]: true }));
        const statusParam = status || 'missing';
        // Add cache-busting to ensure fresh data
        const url = `${API}/api/missing-persons?status=${statusParam}&_t=${Date.now()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${key}`);
        const data = await res.json();
        setter(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${key}:`, err);
        setError(err.message || "Fetch error");
        setter([]);
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    };

    // Fetch found and missing persons
    fetchList("found", setFoundList, "found");
    fetchList("missing", setMissingList, "missing");
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data when component becomes visible (e.g., user switches back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const renderRecord = (p) => (
    <div key={p._id || p.id} className="record-card">
      <div className="record-header">
        <h3>{p.name || "Unknown"}</h3>
        <span className={`status-badge status-${p.status || "missing"}`}>
          {p.status === "found" ? "✅ Found" : "🔍 Missing"}
        </span>
      </div>
      
      {p.photo && (
        <div className="record-photo">
          <img src={p.photo} alt={p.name || ""} />
        </div>
      )}
      
      <div className="record-details">
        {p.age && <p><strong>Age:</strong> {p.age} years</p>}
        {p.lastSeen && <p><strong>Last Seen:</strong> {p.lastSeen}</p>}
        {p.createdAt && (
          <p><strong>Reported:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );

  const activeList = tab === "found" ? foundList : missingList;
  const isLoading = tab === "found" ? loading.found : loading.missing;

  return (
    <>
      <Navbar />
      <div className="found-missing-page">
        <div className="page-header">
          <h1>🔍 Found & Missing Persons</h1>
          <p>Browse through reported missing and found persons</p>
        </div>

        <div className="tab-container">
          <button
            onClick={() => setTab("missing")}
            className={`tab-button ${tab === "missing" ? "active" : ""}`}
          >
            🔍 Missing ({missingList.length})
          </button>
          <button
            onClick={() => setTab("found")}
            className={`tab-button ${tab === "found" ? "active" : ""}`}
          >
            ✅ Found ({foundList.length})
          </button>
          <button
            onClick={fetchData}
            className="refresh-button"
            title="Refresh data"
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ Error: {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading {tab} persons...</p>
          </div>
        ) : activeList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No {tab} persons available</h3>
            <p>
              {tab === "missing" 
                ? "No missing persons have been reported yet."
                : "No found persons have been reported yet."}
            </p>
          </div>
        ) : (
          <div className="records-grid">
            {activeList.map(renderRecord)}
          </div>
        )}
      </div>
    </>
  );
}