import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import opportunities from "./routes/opportunities.js";
import professors from "./routes/professors.js";
import users from "./routes/users.js";
import { connectToDatabase } from "./db/connection.js";
import { initAuth } from "./auth.js";

const PORT = process.env.PORT || 8000;
const app = express();

// Credentials-aware CORS — required for better-auth cookie sessions.
app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    credentials: true,
  })
);

async function startServer() {
  try {
    const db = await connectToDatabase();
    const auth = initAuth(db);

    // Auth routes MUST be mounted before express.json().
    // Express v5 uses /*splat instead of /* for wildcard routes.
    app.all("/api/auth/*splat", toNodeHandler(auth));

    app.use(express.json());
    app.use("/opportunities", opportunities);
    app.use("/professors", professors);
    app.use("/users", users);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
