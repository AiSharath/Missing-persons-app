import * as faceapi from "face-api.js";

export const loadFaceModels = async () => {
  // Try local models first (faster and more reliable), then fallback to CDN
  // The models are typically in the /weights directory
  const MODEL_URLS = [
    "/models", // Local models (prioritized for speed and reliability)
    "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights",
    "https://unpkg.com/face-api.js@0.22.2/weights",
    "https://cdn.jsdelivr.net/npm/face-api.js/models"
  ];

  let loaded = false;
  let lastError = null;

  for (const MODEL_URL of MODEL_URLS) {
    try {
      console.log(`Attempting to load models from: ${MODEL_URL}`);
      
      // Test if the manifest file is accessible first (for local models)
      if (MODEL_URL.startsWith('/')) {
        try {
          const testUrl = `${MODEL_URL}/ssd_mobilenetv1_model-weights_manifest.json`;
          const response = await fetch(testUrl);
          if (!response.ok) {
            console.warn(`Manifest file not accessible at ${testUrl}, status: ${response.status}`);
            continue;
          }
          console.log(`✅ Manifest file accessible at ${testUrl}`);
        } catch (fetchErr) {
          console.warn(`Cannot access manifest file at ${MODEL_URL}:`, fetchErr);
          continue;
        }
      }
      
      // Load models sequentially for better error reporting
      console.log(`Loading ssdMobilenetv1 from ${MODEL_URL}...`);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      console.log(`✅ ssdMobilenetv1 loaded`);
      
      console.log(`Loading faceLandmark68Net from ${MODEL_URL}...`);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      console.log(`✅ faceLandmark68Net loaded`);
      
      console.log(`Loading faceRecognitionNet from ${MODEL_URL}...`);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      console.log(`✅ faceRecognitionNet loaded`);

      console.log(`✅ All face models loaded successfully from: ${MODEL_URL}`);
      loaded = true;
      break;
    } catch (error) {
      console.warn(`Failed to load from ${MODEL_URL}:`, error);
      console.warn(`Error details:`, {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      lastError = error;
      // Continue to next URL
      continue;
    }
  }

  if (!loaded) {
    // Last resort: try loading models one by one with more detailed error info
    const detailedErrors = [];
    const UNPKG_URL = "https://unpkg.com/face-api.js@0.22.2/weights";
    
    try {
      console.log(`Trying sequential loading from: ${UNPKG_URL}`);
      
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(UNPKG_URL);
        console.log("✅ ssdMobilenetv1 loaded");
      } catch (e) {
        detailedErrors.push(`ssdMobilenetv1: ${e.message}`);
        throw e;
      }

      try {
        await faceapi.nets.faceLandmark68Net.loadFromUri(UNPKG_URL);
        console.log("✅ faceLandmark68Net loaded");
      } catch (e) {
        detailedErrors.push(`faceLandmark68Net: ${e.message}`);
        throw e;
      }

      try {
        await faceapi.nets.faceRecognitionNet.loadFromUri(UNPKG_URL);
        console.log("✅ faceRecognitionNet loaded");
      } catch (e) {
        detailedErrors.push(`faceRecognitionNet: ${e.message}`);
        throw e;
      }

      console.log(`✅ All face models loaded successfully from: ${UNPKG_URL}`);
      loaded = true;
    } catch (finalError) {
      console.error("All model loading attempts failed");
      const errorDetails = detailedErrors.length > 0 
        ? detailedErrors.join("; ") 
        : (lastError?.message || finalError?.message || "Unknown error");
      
      throw new Error(
        `Failed to load face recognition models. This usually means:\n` +
        `1. No internet connection\n` +
        `2. CDN is blocked or unavailable\n` +
        `3. CORS issues\n\n` +
        `Error details: ${errorDetails}\n\n` +
        `Solution: Download models locally and place them in /public/models folder.`
      );
    }
  }

  if (!loaded) {
    throw new Error(
      `Failed to load face recognition models from all sources. ` +
      `Last error: ${lastError?.message || "Unknown error"}`
    );
  }
};
