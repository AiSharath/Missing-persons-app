import * as faceapi from "face-api.js";

export const loadFaceModels = async () => {
  // Try local models first (faster and more reliable), then fallback to CDN
  const MODEL_URLS = [
    "/models", // Local models (prioritized for speed and reliability)
    "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights",
    "https://unpkg.com/face-api.js@0.22.2/weights",
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
          // Verify we can actually read the manifest - be more lenient with validation
          const manifest = await response.json();
          if (!manifest) {
            console.warn(`Invalid manifest file at ${testUrl} - null or undefined`);
            continue;
          }
          // Accept both array and object formats
          if (Array.isArray(manifest) && manifest.length === 0) {
            console.warn(`Empty manifest array at ${testUrl}`);
            continue;
          }
          console.log(`✅ Manifest file accessible and valid at ${testUrl}`);
        } catch (fetchErr) {
          console.warn(`Cannot access manifest file at ${MODEL_URL}:`, fetchErr.message);
          continue;
        }
      }
      
      // Load models sequentially for better error reporting
      // Use Promise.allSettled to load all models and handle errors gracefully
      console.log(`Loading ssdMobilenetv1 from ${MODEL_URL}...`);
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        console.log(`✅ ssdMobilenetv1 loaded`);
      } catch (err) {
        console.error(`Failed to load ssdMobilenetv1:`, err);
        throw new Error(`Failed to load ssdMobilenetv1: ${err.message}`);
      }
      
      console.log(`Loading faceLandmark68Net from ${MODEL_URL}...`);
      try {
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log(`✅ faceLandmark68Net loaded`);
      } catch (err) {
        console.error(`Failed to load faceLandmark68Net:`, err);
        throw new Error(`Failed to load faceLandmark68Net: ${err.message}`);
      }
      
      console.log(`Loading faceRecognitionNet from ${MODEL_URL}...`);
      try {
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log(`✅ faceRecognitionNet loaded`);
      } catch (err) {
        console.error(`Failed to load faceRecognitionNet:`, err);
        throw new Error(`Failed to load faceRecognitionNet: ${err.message}`);
      }

      // Wait a bit for models to fully initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify models are actually loaded
      const isModelLoaded = faceapi.nets.ssdMobilenetv1.isLoaded && 
                            faceapi.nets.faceLandmark68Net.isLoaded && 
                            faceapi.nets.faceRecognitionNet.isLoaded;
      
      if (!isModelLoaded) {
        // Sometimes the isLoaded flag takes a moment to update, check again
        await new Promise(resolve => setTimeout(resolve, 200));
        const isModelLoadedRetry = faceapi.nets.ssdMobilenetv1.isLoaded && 
                                  faceapi.nets.faceLandmark68Net.isLoaded && 
                                  faceapi.nets.faceRecognitionNet.isLoaded;
        
        if (!isModelLoadedRetry) {
          throw new Error("Models loaded but isLoaded flags are false after retry");
        }
      }

      console.log(`✅ All face models loaded and verified from: ${MODEL_URL}`);
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
    const errorDetails = lastError?.message || "Unknown error";
    throw new Error(
      `Failed to load face recognition models from all sources.\n\n` +
      `Tried: ${MODEL_URLS.join(", ")}\n\n` +
      `Last error: ${errorDetails}\n\n` +
      `Please ensure:\n` +
      `1. Models are in /public/models directory\n` +
      `2. You have internet connection for CDN fallback\n` +
      `3. Check browser console for detailed errors`
    );
  }
};
