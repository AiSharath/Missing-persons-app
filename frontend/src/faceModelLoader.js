import * as faceapi from "face-api.js";

export const loadFaceModels = async () => {
  // Get base path - works in both development and production
  // In Vite, public directory files are copied to the root of the build output
  // So /models should work in both dev and production if served correctly
  const getModelBasePath = () => {
    // Use import.meta.env.BASE_URL if available (Vite provides this)
    if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/') {
      return import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
    }
    
    // Try to detect the base path from the current location
    const pathname = window.location.pathname;
    // For SPA routes, remove the route part and keep only the base
    // If pathname is like /face-match, we want just /
    // If pathname is like /app/face-match, we want /app
    const pathParts = pathname.split('/').filter(p => p);
    // If we're at root or have routes, base is usually '/'
    // But if deployed to a subdirectory, we need to detect it
    if (pathParts.length > 0 && !pathParts[0].match(/^(report|register|login|found-missing|face-match)$/)) {
      // Might be in a subdirectory
      return `/${pathParts[0]}`;
    }
    return '';
  };

  const basePath = getModelBasePath();
  const origin = window.location.origin;
  
  // Try local models first (faster and more reliable), then fallback to CDN
  // Try multiple path variations to handle different deployment scenarios
  // In production, if local models fail quickly, fallback to CDN
  const MODEL_URLS = [
    "/models", // Absolute root path (most common) - try this first
    `${origin}/models`, // Full URL with origin
    `${basePath}/models`, // With detected base path
    `${origin}${basePath}/models`, // Full URL with base path
    "./models", // Relative path
    "models", // Relative without leading slash
    "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights", // CDN fallback
    "https://unpkg.com/face-api.js@0.22.2/weights", // Alternative CDN
  ];
  
  console.log('🔍 Model loading configuration:', {
    basePath,
    origin,
    pathname: window.location.pathname,
    modelUrls: MODEL_URLS.slice(0, 4) // Log first few
  });

  let loaded = false;
  let lastError = null;

  for (const MODEL_URL of MODEL_URLS) {
    try {
      console.log(`Attempting to load models from: ${MODEL_URL}`);
      
      // Test if the manifest file is accessible first (for local models)
      // Skip manifest check for CDN URLs - they should work
      if (MODEL_URL.startsWith('http://') || MODEL_URL.startsWith('https://')) {
        // CDN URL - skip manifest check, try loading directly
        console.log(`  Using CDN URL, skipping manifest check`);
      } else {
        // Local model - check manifest first
        try {
          // Build full URL if needed
          const buildFullUrl = (url) => {
            if (url.startsWith('http')) return url;
            if (url.startsWith('/')) return `${origin}${url}`;
            if (url.startsWith('./')) return `${origin}${basePath}/${url.slice(2)}`;
            return `${origin}${basePath}/${url}`;
          };
          
          // Try different path formats for production - with timeout
          const testUrls = [
            `${MODEL_URL}/ssd_mobilenetv1_model-weights_manifest.json`,
            `${MODEL_URL}ssd_mobilenetv1_model-weights_manifest.json`, // In case of trailing slash issue
            `/models/ssd_mobilenetv1_model-weights_manifest.json`, // Absolute root
            `${origin}/models/ssd_mobilenetv1_model-weights_manifest.json`, // Full URL
            `${origin}${basePath}/models/ssd_mobilenetv1_model-weights_manifest.json`, // Full URL with base
          ].map(buildFullUrl);
          
          let manifestResponse = null;
          let testUrl = null;
          
          // Add timeout for manifest check (5 seconds max per URL)
          const manifestCheckTimeout = 5000;
          
          for (const url of testUrls) {
            try {
              console.log(`  Testing manifest at: ${url}`);
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), manifestCheckTimeout);
              
              const response = await fetch(url, { 
                method: 'GET',
                cache: 'no-cache',
                signal: controller.signal
              });
              
              clearTimeout(timeoutId);
              
              if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  manifestResponse = response;
                  testUrl = url;
                  break;
                }
              } else {
                console.log(`  ❌ Manifest not found at ${url} (status: ${response.status})`);
              }
            } catch (e) {
              if (e.name === 'AbortError') {
                console.log(`  ⏱️ Manifest check timeout for ${url}`);
              } else {
                console.log(`  ❌ Error fetching ${url}:`, e.message);
              }
              // Try next URL
              continue;
            }
          }
          
          if (!manifestResponse || !manifestResponse.ok) {
            console.warn(`⚠️ Manifest file not accessible at ${MODEL_URL}, trying next source...`);
            continue;
          }
          
          // Verify we can actually read the manifest - be more lenient with validation
          const manifest = await manifestResponse.json();
          if (!manifest) {
            console.warn(`⚠️ Invalid manifest file at ${testUrl} - null or undefined`);
            continue;
          }
          // Accept both array and object formats
          if (Array.isArray(manifest) && manifest.length === 0) {
            console.warn(`⚠️ Empty manifest array at ${testUrl}`);
            continue;
          }
          console.log(`✅ Manifest file accessible and valid at ${testUrl}`);
        } catch (fetchErr) {
          console.warn(`⚠️ Cannot access manifest file at ${MODEL_URL}:`, fetchErr.message);
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
    const errorMessage = 
      `Failed to load face recognition models from all sources.\n\n` +
      `Tried: ${MODEL_URLS.join(", ")}\n\n` +
      `Last error: ${errorDetails}\n\n` +
      `Please ensure:\n` +
      `1. Models are in /public/models directory\n` +
      `2. You have internet connection for CDN fallback\n` +
      `3. Check browser console for detailed errors`;
    
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};
