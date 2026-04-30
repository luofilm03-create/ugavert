import { useEffect, useState } from "react";
import { onValue, onDisconnect, ref, set, serverTimestamp } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import type { Topic } from "@/lib/topics";

const HEARTBEAT_MS = 25 * 1000;
const STALE_AFTER_MS = 60 * 1000;

export function usePresence(topic: Topic, uid: string) {
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    if (!uid) return;
    const path = `presence/${topic.toLowerCase()}/${uid}`;
    const myRef = ref(rtdb, path);

    const beat = () => { void set(myRef, { online: true, lastSeen: serverTimestamp() }); };
    beat();
    onDisconnect(myRef).remove();
    const heartbeat = window.setInterval(beat, HEARTBEAT_MS);

    const allRef = ref(rtdb, `presence/${topic.toLowerCase()}`);
    const unsub = onValue(allRef, (snap) => {
      const data = snap.val() as Record<string, { lastSeen?: number }> | null;
      if (!data) { setOnlineCount(1); return; }
      const cutoff = Date.now() - STALE_AFTER_MS;
      let count = 0;
      for (const u of Object.values(data)) {
        const seen = typeof u?.lastSeen === "number" ? u.lastSeen : Date.now();
        if (seen >= cutoff) count++;
      }
      setOnlineCount(Math.max(1, count));
    });

    return () => {
      window.clearInterval(heartbeat);
      unsub();
      void set(myRef, null);
    };
  }, [topic, uid]);

  return onlineCount;
}
