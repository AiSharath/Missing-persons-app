import mongoose from "mongoose";

const missingPersonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    lastSeen: { type: String, required: true, trim: true },
    photo: { type: String, required: false }, // base64 string or URL
    faceDescriptor: {
      type: [Number],
      required: false,
      default: [],
    },
    status: {
      type: String,
      enum: ["missing", "found"],
      default: "missing",
    },
  },
  { timestamps: true }
);

const MissingPerson = mongoose.model("MissingPerson", missingPersonSchema);
export default MissingPerson;

