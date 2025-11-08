# Face-API.js Models

This directory contains the pre-trained models for face-api.js face recognition.

## Models Included:

1. **ssd_mobilenetv1_model** - Face detection model
   - `ssd_mobilenetv1_model-weights_manifest.json`
   - `ssd_mobilenetv1_model-shard1`

2. **face_landmark_68_model** - Facial landmark detection model
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`

3. **face_recognition_model** - Face recognition/descriptor model
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `face_recognition_model-shard2`

## Source

These models were downloaded from:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

## Usage

The models are automatically loaded by the application from this directory.
If you need to update them, download the latest versions from the GitHub repository above.

