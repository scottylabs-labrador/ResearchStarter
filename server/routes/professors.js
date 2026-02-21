import express from "express";
import { getDb } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

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

// Get a single professor by id
router.get("/:id", async (req, res) => {
  try {
    let db = getDb();
    let collection = db.collection("Professors");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

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
