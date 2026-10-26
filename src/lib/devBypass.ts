/** The local design preview: a mock session and mock data stand in for the backend. Always false in production builds. */
export const isDevBypass = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === "true";
