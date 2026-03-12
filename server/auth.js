import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { genericOAuth } from "better-auth/plugins";

/** @type {ReturnType<import("better-auth").betterAuth> | null} */
let auth = null;

/**
 * Initialize the auth instance after the MongoDB connection is ready.
 * Must be called before getAuth() or mounting auth routes.
 * @param {import("mongodb").Db} db
 */
export function initAuth(db) {
  const serverUrl = process.env.SERVER_URL || "http://localhost:5050";
  const clientUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

  const clientId = process.env.AUTH_CLIENT_ID;
  const clientSecret = process.env.AUTH_CLIENT_SECRET;
  const issuer = process.env.AUTH_ISSUER;
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!clientId || !clientSecret || !issuer || !secret) {
    throw new Error(
      "Missing required auth environment variables. Check AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, AUTH_ISSUER, and BETTER_AUTH_SECRET in config.env."
    );
  }

  auth = betterAuth({
    baseURL: serverUrl,
    trustedOrigins: [clientUrl],
    secret,
    database: mongodbAdapter(db),

    // Set the user's id to their Andrew ID (email prefix before @).
    // We use `full_email` from the Keycloak JWT payload because the `email`
    // field may be an alias email rather than the actual Andrew ID address.
    databaseHooks: {
      user: {
        create: {
          before: async (user) => ({
            data: {
              ...user,
              id: (/** @type {string} */ (user["full_email"] || user.email)).split("@")[0],
            },
          }),
        },
      },
    },

    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "keycloak",
            clientId,
            clientSecret,
            discoveryUrl: `${issuer}/.well-known/openid-configuration`,
            redirectURI: `${serverUrl}/api/auth/oauth2/callback/keycloak`,
            scopes: ["openid", "email", "profile", "offline_access"],
          },
        ],
      }),
    ],
  });

  return auth;
}

export function getAuth() {
  if (!auth) throw new Error("Auth not initialized. Call initAuth(db) first.");
  return auth;
}
