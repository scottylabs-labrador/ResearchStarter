import express from "express";
import { getDb } from "../db/connection.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// All user routes require authentication.
router.use(requireAuth);

/**
 * Casts a string id to the type MongoDB's driver expects for _id queries.
 * better-auth stores the andrewID as a plain string _id, not an ObjectId.
 * @param {string} id
 */
const strId = (id) => /** @type {import("mongodb").Filter<import("mongodb").Document>} */ (/** @type {unknown} */ ({ _id: id }));

// ---------------------------------------------------------------------------
// GET /users/recommended
// Must be defined BEFORE GET /:id so "recommended" is not treated as an id.
// Returns opportunities matching the user's departments/interests.
// Falls back to the 10 most recently added opportunities if no matches.
// ---------------------------------------------------------------------------
router.get("/recommended", async (req, res) => {
  const session = /** @type {any} */ (req).session;
  try {
    const db = getDb();

    const user = await db.collection("user").findOne(strId(session.user.id));
    const userDepts     = /** @type {string[]} */ (user?.departments ?? []);
    const userInterests = /** @type {string[]} */ (user?.interests   ?? []);
    const matchTerms    = [...new Set([...userDepts, ...userInterests])];

    /** @type {any[]} */
    let results = [];

    if (matchTerms.length > 0) {
      results = await db.collection("ResearchOpportunities").find({
        $or: [
          { department: { $elemMatch: { $in: matchTerms } } },
          { keywords:   { $elemMatch: { $in: matchTerms } } },
        ],
      }).limit(20).toArray();
    }

    // No personalised matches — fall back to most recently added.
    if (results.length === 0) {
      results = await db.collection("ResearchOpportunities")
        .find({})
        .sort({ timeAdded: -1 })
        .limit(10)
        .toArray();
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching recommendations" });
  }
});

// ---------------------------------------------------------------------------
// GET /users/:id
// Returns the full profile for a user. Users may only fetch their own profile.
// ---------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
  // const session = /** @type {any} */ (req).session;
  // if (session.user.id !== req.params.id) {
  //   return res.status(403).json({ error: "Forbidden" });
  // }

  try {
    const db = getDb();
    const query = { _id: new ObjectId(req.params.id) };
    const user = await db.collection("user").findOne(query);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// ---------------------------------------------------------------------------
// POST /users/add/:id
// Ensures app-specific fields exist on the user document with default values.
// better-auth creates the user on first OAuth login, but this backfills
// any fields that weren't set during that initial creation.
// ---------------------------------------------------------------------------
router.post("/add/:id", async (req, res) => {
  // const session = /** @type {any} */ (req).session;
  // if (session.user.id !== req.params.id) {
  //   return res.status(403).json({ error: "Forbidden" });
  // }

  try {
    const db = getDb();
    const query = { _id: new ObjectId(req.params.id) };

    // Use an aggregation pipeline update so we can conditionally set fields
    // only when they are missing, without overwriting existing data.
    await db.collection("user").updateOne(
      query,
      [
        {
          $set: {
            saved:       { $ifNull: ["$saved",       []] },
            bio:         { $ifNull: ["$bio",         ""] },
            major:       { $ifNull: ["$major",       ""] },
            interests:   { $ifNull: ["$interests",   []] },
            experiences: { $ifNull: ["$experiences", []] },
          },
        },
      ]
    );

    const user = await db.collection("user").findOne(query);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error ensuring user defaults" });
  }
});

// ---------------------------------------------------------------------------
// POST /users/saved/:id
// Adds or removes a single opportunity from the user's saved list.
// Body: { opportunityId: string, action: "add" | "remove" }
// ---------------------------------------------------------------------------
router.post("/saved/:id", async (req, res) => {
  // const session = /** @type {any} */ (req).session;
  // if (session.user.id !== req.params.id) {
  //   return res.status(403).json({ error: "Forbidden" });
  // }

  const { opportunityId, action } = req.body;
  if (!opportunityId || !["add", "remove"].includes(action)) {
    return res.status(400).json({
      error: 'Body must include opportunityId and action ("add" or "remove")',
    });
  }

  const query = { _id: new ObjectId(req.params.id) };

  try {
    const db = getDb();
    const op =
      action === "add"
        ? { $addToSet: { saved: opportunityId } }
        : { $pull: { saved: opportunityId } };

    await db.collection("user").updateOne(query, op);
    const user = await db.collection("user").findOne(query);
    res.json({ saved: user?.saved ?? [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating saved opportunities" });
  }
});

// ---------------------------------------------------------------------------
// POST /users/:id
// Updates editable profile fields: bio, major, interests, experiences.
// Read-only CMU fields (isProfessor, class, colleges, departments) are ignored.
// ---------------------------------------------------------------------------
router.post("/:id", async (req, res) => {
  const session = /** @type {any} */ (req).session;
  if (session.user.id !== req.params.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const EDITABLE_FIELDS = ["bio", "major", "interests", "experiences"];
  /** @type {Record<string, any>} */
  const updates = {};
  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No editable fields provided" });
  }

  try {
    const db = getDb();
    await db.collection("user").updateOne(strId(req.params.id), { $set: updates });
    const user = await db.collection("user").findOne(strId(req.params.id));
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user" });
  }
});

export default router;
