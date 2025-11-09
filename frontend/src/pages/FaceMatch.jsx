import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { loadFaceModels } from "../faceModelLoader.js";
import { handleFaceMatching } from "../extractDescriptor.js";
import "./FaceMatch.css";

export default function FaceMatch() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Load face models on component mount
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setLoading(true);
        setError("");
        await loadFaceModels();
        setModelsLoaded(true);
        console.log("Face models loaded successfully");
      } catch (err) {
        console.error("Failed to load face models:", err);
        setError(err.message || "Failed to load face recognition models. Please check your internet connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeModels();
  }, []);

  const handleRetryLoad = () => {
    setModelsLoaded(false);
    setError("");
    const initializeModels = async () => {
      try {
        setLoading(true);
        await loadFaceModels();
        setModelsLoaded(true);
        console.log("Face models loaded successfully");
      } catch (err) {
        console.error("Failed to load face models:", err);
        setError(err.message || "Failed to load face recognition models. Please check your internet connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    initializeModels();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatch = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    if (!modelsLoaded) {
      setError("Face models are still loading. Please wait...");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const matchResult = await handleFaceMatching(selectedFile);
      setResult(matchResult);
    } catch (err) {
      console.error("Face matching error:", err);
      setError(err.message || "Failed to match face. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <>
      <Navbar />
      <div className="face-match-container">
        <div className="face-match-card">
        <h1>🔍 Face Recognition Search</h1>
        <p className="subtitle">
          Upload an image to search for a person in our database
        </p>

        {!modelsLoaded && !error && (
          <div className="loading-models">
            <p>Loading face recognition models...</p>
            <div className="spinner"></div>
          </div>
        )}

        {error && !modelsLoaded && (
          <div className="error-message">
            <p style={{ whiteSpace: "pre-line" }}>{error}</p>
            <button onClick={handleRetryLoad} className="retry-button">
              🔄 Retry Loading Models
            </button>
            <div className="error-help">
              <p><strong>Alternative Solution:</strong></p>
              <p>If CDN loading continues to fail, you can download the models locally:</p>
              <ol style={{ textAlign: "left", display: "inline-block" }}>
                <li>Download models from: <a href="https://github.com/justadudewhohacks/face-api.js/tree/master/weights" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li>Place them in <code>frontend/public/models</code> folder</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        )}

        {modelsLoaded && (
          <>
            <div className="upload-section">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="file-input"
                />
                <label htmlFor="image-upload" className="file-label">
                  {selectedFile ? "Change Image" : "Choose Image"}
                </label>
              </div>

              {preview && (
                <div className="preview-section">
                  <h3>Selected Image:</h3>
                  <div className="image-preview">
                    <img src={preview} alt="Preview" />
                  </div>
                </div>
              )}

              {selectedFile && (
                <div className="action-buttons">
                  <button
                    onClick={handleMatch}
                    disabled={loading}
                    className="match-button"
                  >
                    {loading ? "Matching..." : "🔍 Search Face"}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="reset-button"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {error && modelsLoaded && (
              <div className="error-message">{error}</div>
            )}

            {result && (
              <div className="result-section">
                {result.found ? (
                  <div className="result-found">
                    <div className="success-icon">✅</div>
                    <h2>Person Found!</h2>
                    {result.statusUpdated && (
                      <div style={{
                        background: "#d4edda",
                        color: "#155724",
                        padding: "10px 15px",
                        borderRadius: "5px",
                        marginBottom: "15px",
                        border: "1px solid #c3e6cb"
                      }}>
                        <strong>🎉 Status Updated!</strong> This person has been automatically marked as "Found" in the database.
                      </div>
                    )}
                    <div className="user-details">
                      <p><strong>Name:</strong> {(result.person || result.user)?.name}</p>
                      {(result.person || result.user)?.type === 'missingPerson' ? (
                        <>
                          <p><strong>Age:</strong> {(result.person || result.user)?.age}</p>
                          <p><strong>Last Seen:</strong> {(result.person || result.user)?.lastSeen}</p>
                          <p><strong>Status:</strong> 
                            <span style={{
                              marginLeft: "8px",
                              padding: "4px 12px",
                              borderRadius: "12px",
                              backgroundColor: "#d4edda",
                              color: "#155724",
                              fontSize: "0.9em",
                              fontWeight: "600"
                            }}>
                              ✅ {(result.person || result.user)?.status === 'found' ? 'Found' : 'Missing'}
                            </span>
                          </p>
                        </>
                      ) : (
                        <p><strong>Email:</strong> {(result.person || result.user)?.email}</p>
                      )}
                      {result.confidence && (
                        <p>
                          <strong>Confidence:</strong>{" "}
                          <span style={{ color: result.confidence > 0.8 ? "#28a745" : result.confidence > 0.6 ? "#ffc107" : "#dc3545" }}>
                            {(result.confidence * 100).toFixed(2)}%
                          </span>
                        </p>
                      )}
                      {result.distance && (
                        <p style={{ fontSize: "0.9em", color: "#666" }}>
                          <strong>Distance:</strong> {result.distance.toFixed(4)}
                        </p>
                      )}
                    </div>
                    {(result.person || result.user)?.type === 'missingPerson' && (
                      <div style={{ marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "8px" }}>
                        <p style={{ margin: 0, fontSize: "0.95em", color: "#666" }}>
                          💡 This person will now appear in the <strong>"Found"</strong> tab on the Found & Missing page.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="result-not-found">
                    <div className="not-found-icon">❌</div>
                    <h2>Person Not Found</h2>
                    <p>
                      {result.message ||
                        "No matching person found in the database."}
                    </p>
                    {result.bestDistance && (
                      <p style={{ fontSize: "0.9em", color: "#666" }}>
                        Best match distance: {result.bestDistance.toFixed(4)} (threshold: {result.threshold || 0.6})
                      </p>
                    )}
                    <p className="suggestion">
                      The person might not be registered in our system yet, or the face doesn't match closely enough.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </>
  );
}

