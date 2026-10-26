import { fromNodeHeaders } from "better-auth/node";
import { getAuth } from "../auth.js";

/**
 * Express middleware that requires a valid better-auth session.
 * Attaches `req.session` (with `user` and `session` properties) on success.
 * Returns 401 if no session is found.
 *
 * @type {import("express").RequestHandler}
 */
export async function requireAuth(req, res, next) {
  try {
    const session = await getAuth().api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.session = session;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
