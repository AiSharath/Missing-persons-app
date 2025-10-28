import * as faceapi from "face-api.js";

export const loadFaceModels = async () => {
  const MODEL_URL = "https://cdn.jsdelivr.net/npm/face-api.js/models";

  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

  console.log("✅ Face models loaded from CDN");
};
