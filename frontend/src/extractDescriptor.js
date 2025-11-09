import * as faceapi from "face-api.js";

export const getFaceDescriptor = async (file) => {
  // Check if models are loaded - with retry logic
  let isModelLoaded = faceapi.nets.ssdMobilenetv1.isLoaded && 
                      faceapi.nets.faceLandmark68Net.isLoaded && 
                      faceapi.nets.faceRecognitionNet.isLoaded;
  
  // Sometimes the isLoaded flag takes a moment to update
  if (!isModelLoaded) {
    await new Promise(resolve => setTimeout(resolve, 100));
    isModelLoaded = faceapi.nets.ssdMobilenetv1.isLoaded && 
                    faceapi.nets.faceLandmark68Net.isLoaded && 
                    faceapi.nets.faceRecognitionNet.isLoaded;
  }
  
  if (!isModelLoaded) {
    throw new Error("Face recognition models are not loaded. Please wait for models to load.");
  }

  console.log("Converting file to image...");
  let image;
  try {
    image = await faceapi.bufferToImage(file);
    console.log("Image loaded, detecting face...");
  } catch (error) {
    console.error("Error converting file to image:", error);
    throw new Error("Failed to load image. Please ensure the file is a valid image.");
  }

  let detection;
  try {
    detection = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();
  } catch (error) {
    console.error("Error detecting face:", error);
    throw new Error("Failed to detect face. Please try another image.");
  }

  if (!detection) {
    throw new Error("No face detected. Try another image.");
  }

  if (!detection.descriptor) {
    throw new Error("Face detected but descriptor extraction failed. Please try another image.");
  }

  const descriptor = Array.from(detection.descriptor);
  console.log(`Face detected! Descriptor length: ${descriptor.length}`);
  
  if (descriptor.length === 0) {
    throw new Error("Face descriptor is empty. Please try another image.");
  }
  
  return descriptor;
};

export const sendFaceDescriptor = async (descriptor) => {
  try {
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${API}/api/face/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ descriptor }),
    });

    if (!response.ok) {
      throw new Error('Face matching failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error in face matching:', error);
    throw error;
  }
};

// Usage example:
export const handleFaceMatching = async (file) => {
  try {
    // First get the descriptor
    const descriptor = await getFaceDescriptor(file);
    
    // Then send it to backend
    const matchResult = await sendFaceDescriptor(descriptor);
    
    return matchResult;
  } catch (error) {
    console.error('Face matching process failed:', error);
    throw error;
  }
};
