import express from "express";
import {
  registerMissingPerson,
  getMissingPersons,
  getMissingPersonById,
  updateMissingPersonStatus,
} from "../controllers/missingPersonController.js";

const router = express.Router();

router.post("/register", registerMissingPerson);
router.get("/", getMissingPersons);
router.get("/:id", getMissingPersonById);
router.patch("/:id/status", updateMissingPersonStatus);
router.put("/:id/status", updateMissingPersonStatus); // Support both PUT and PATCH

export default router;

