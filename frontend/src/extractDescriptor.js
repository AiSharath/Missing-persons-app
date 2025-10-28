import * as faceapi from "face-api.js";

export const getFaceDescriptor = async (file) => {
  const image = await faceapi.bufferToImage(file);

  const detection = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    throw new Error("No face detected. Try another image.");
  }

  return Array.from(detection.descriptor);
};
