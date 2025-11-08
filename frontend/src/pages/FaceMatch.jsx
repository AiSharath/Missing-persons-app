import React, { useState, useEffect } from "react";
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
                    <h2>User Found!</h2>
                    <div className="user-details">
                      <p><strong>Name:</strong> {result.user.name}</p>
                      <p><strong>Email:</strong> {result.user.email}</p>
                      {result.confidence && (
                        <p>
                          <strong>Confidence:</strong>{" "}
                          {(result.confidence * 100).toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="result-not-found">
                    <div className="not-found-icon">❌</div>
                    <h2>User Not Found</h2>
                    <p>
                      {result.message ||
                        "No matching person found in the database."}
                    </p>
                    <p className="suggestion">
                      The person might not be registered in our system yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

