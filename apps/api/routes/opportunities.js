import express from "express";
import { getDb } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Retrieve a list of all research opportunities.
router.get("/", async (req, res) => {
  try {
    let db = getDb(); // Get the db instance
    let collection = db.collection("ResearchProjects");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching opportunities");
  }
});

// Get a single research opportunity by id
router.get("/:id", async (req, res) => {
  try {
    let db = getDb();
    let collection = db.collection("ResearchProjects");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching opportunity");
  }
});

// Get research opportunity by andrew id
router.get("/professor/:andrew_id", async (req, res) => {
  try {
    let db = getDb();
    let collection = db.collection("ResearchProjects");
    let contact = "Contact." + req.params.andrew_id
    let query = { [contact] : { $exists: true } };
    let result = await collection.find(query).toArray();

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching opportunity");
  }
});

// Create a new research opportunity.
router.post("/", async (req, res) => {
  try {
    const b = req.body;
    let newDocument = {
      "Project Title":        b.projectTitle,
      "Contact":              b.contact,
      "Department":           b.department,
      "Description":          b.description,
      "Desired Skill Level":  b.desiredSkillLevel,
      "Paid/Unpaid":          b.paidUnpaid,
      "Position":             b.position,
      "Prereqs":              b.prereqs,
      "Relevant Links":       b.relevantLinks,
      "Source":               b.source,
      "Time Added":           b.timeAdded,
      "Time Commitment":      b.timeCommitment,
      "Anticipated End Date": b.anticipatedEndDate,
      "Keywords":             b.keywords,
      "Colleges":             b.colleges,
      "Enable Apply":         b.enableApply,
    };
    let db = getDb();
    let collection = db.collection("ResearchProjects");
    let result = await collection.insertOne(newDocument);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding research opportunity");
  }
});

// Update a research opportunity by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    let db = getDb();
    let collection = db.collection("ResearchProjects");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating research opportunity");
  }
});

// Delete a research opportunity
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    let db = getDb();
    let collection = db.collection("ResearchProjects");
    let result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting research opportunity");
  }
});

export default router;