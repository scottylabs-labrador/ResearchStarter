import { useEffect, useState } from "react";
import { useSession } from "./authClient";

/** Whether the signed-in user has saved a listing, and a toggle that saves the change (and undoes it if saving fails). */
export function useBookmark(opportunityId: string, enabled = true) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userId || !enabled) return;
    let cancelled = false;
    fetch(`/api/users/${userId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((user) => {
        if (!cancelled) setSaved(Array.isArray(user.saved) && user.saved.includes(opportunityId));
      })
      .catch((err) => console.error("Error fetching bookmarks", err));
    return () => {
      cancelled = true;
    };
  }, [userId, opportunityId, enabled]);

  const toggle = async () => {
    const next = !saved;
    setSaved(next);
    if (!userId) return;
    try {
      const res = await fetch(`/api/users/saved/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId, action: next ? "add" : "remove" }),
      });
      if (!res.ok) throw new Error(res.statusText);
    } catch (err) {
      console.error("Error saving bookmark", err);
      setSaved(!next);
    }
  };

  return { saved, toggle };
}
