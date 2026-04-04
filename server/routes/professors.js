import express from "express";
import { getDb } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function emailLookupFilter(localPart) {
  if (!localPart) return null;
  const exact = localPart + "@andrew.cmu.edu";
  const re = new RegExp("^" + escapeRegex(localPart) + "@", "i");
  return {
    $or: [
      { Email: exact },
      { Email: { $regex: re } },
      { email: exact },
      { email: { $regex: re } },
    ],
  };
}

// Retrieve a list of all professors.
router.get("/", async (req, res) => {
  try {
    let db = getDb();
    let collection = db.collection("Professors");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching professors");
  }
});

// One professor: MongoDB _id (24 hex), full email, or Andrew ID (local part)
router.get("/:id", async (req, res) => {
  try {
    let db = getDb();
    let collection = db.collection("Professors");
    const raw = decodeURIComponent(req.params.id).trim();

    let result = null;

    if (/^[a-f\d]{24}$/i.test(raw)) {
      try {
        result = await collection.findOne({ _id: new ObjectId(raw) });
      } catch {
        // invalid ObjectId
      }
    }

    if (!result) {
      const localPart = raw.includes("@") ? raw.split("@")[0].trim() : raw;
      const filter = emailLookupFilter(localPart);
      if (filter) {
        result = await collection.findOne(filter);
      }
    }

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching professor");
  }
});

export default router;
