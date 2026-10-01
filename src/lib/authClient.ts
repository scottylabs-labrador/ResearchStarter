import { createAuthClient } from "better-auth/react";
import { genericOAuthClient, inferAdditionalFields } from "better-auth/client/plugins";

// baseURL points to the Vite dev server; the /api/auth proxy rule forwards
// requests to the backend without stripping the prefix.
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    genericOAuthClient(),
    // Mirrors user.additionalFields in server/auth.js so session.user is typed with them.
    inferAdditionalFields({
      user: {
        andrewId: { type: "string", required: false },
        isProfessor: { type: "boolean", required: false },
        firstName: { type: "string", required: false },
        lastName: { type: "string", required: false },
        class: { type: "string", required: false },
      },
    }),
  ],
});

export const { signIn, signOut, useSession } = authClient;
