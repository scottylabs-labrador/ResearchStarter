import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

// baseURL points to the Vite dev server; the /api/auth proxy rule forwards
// requests to the backend without stripping the prefix.
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [genericOAuthClient()],
});

export const { signIn, signOut, useSession } = authClient;
