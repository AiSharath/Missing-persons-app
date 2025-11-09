import * as faceapi from "face-api.js";

export const getFaceDescriptor = async (file) => {
  // Check if models are loaded
  const isModelLoaded = faceapi.nets.ssdMobilenetv1.isLoaded && 
                        faceapi.nets.faceLandmark68Net.isLoaded && 
                        faceapi.nets.faceRecognitionNet.isLoaded;
  
  if (!isModelLoaded) {
    throw new Error("Face recognition models are not loaded. Please wait for models to load.");
  }

  console.log("Converting file to image...");
  const image = await faceapi.bufferToImage(file);
  console.log("Image loaded, detecting face...");

  const detection = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error("No face detected. Try another image.");
  }

  const descriptor = Array.from(detection.descriptor);
  console.log(`Face detected! Descriptor length: ${descriptor.length}`);
  
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
