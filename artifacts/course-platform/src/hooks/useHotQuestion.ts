import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TOPIC_META, type Topic } from "@/lib/topics";

export const QUESTION_DURATION_MS = 2 * 60 * 1000; // 2 minutes
const HISTORY_SIZE = 4; // remember last N indices to avoid quick repeats

type RemoteState = {
  index: number;
  startedAt: number;
  history: number[];
};

function pickNextIndex(total: number, history: number[]): number {
  if (total <= 1) return 0;
  const blocked = new Set(history.slice(-Math.min(HISTORY_SIZE, total - 1)));
  const candidates: number[] = [];
  for (let i = 0; i < total; i++) if (!blocked.has(i)) candidates.push(i);
  const pool = candidates.length ? candidates : [...Array(total).keys()].filter((i) => i !== history[history.length - 1]);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useHotQuestion(topic: Topic) {
  const cfg = TOPIC_META[topic];
  const total = cfg.questions.length;

  const [state, setState] = useState<RemoteState>({ index: 0, startedAt: Date.now(), history: [] });
  const [now, setNow] = useState(Date.now());
  const advancingRef = useRef(false);

  // Subscribe to the live question state for this topic
  useEffect(() => {
    const ref = doc(db, "topics", topic.toLowerCase());

    // Make sure the doc exists; if missing, seed it.
    void (async () => {
      try {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          if (!snap.exists()) {
            const seed: RemoteState = { index: 0, startedAt: Date.now(), history: [0] };
            tx.set(ref, seed);
          }
        });
      } catch {
        // Fallback: best-effort write without transaction
        try { await setDoc(ref, { index: 0, startedAt: Date.now(), history: [0] }, { merge: true }); }
        catch { /* ignore */ }
      }
    })();

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as Partial<RemoteState>;
      const safeIndex = typeof data.index === "number" ? Math.min(Math.max(data.index, 0), total - 1) : 0;
      setState({
        index: safeIndex,
        startedAt: typeof data.startedAt === "number" ? data.startedAt : Date.now(),
        history: Array.isArray(data.history) ? data.history.slice(-HISTORY_SIZE) : [safeIndex],
      });
    });
    return () => unsub();
  }, [topic, total]);

  // Tick a local clock once per second so the countdown updates
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  // When the duration elapses, the first client to notice advances it via a transaction
  useEffect(() => {
    const elapsed = now - state.startedAt;
    if (elapsed < QUESTION_DURATION_MS) return;
    if (advancingRef.current) return;
    advancingRef.current = true;

    const ref = doc(db, "topics", topic.toLowerCase());
    void (async () => {
      try {
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          const remote = (snap.exists() ? snap.data() : null) as Partial<RemoteState> | null;
          const remoteStarted = typeof remote?.startedAt === "number" ? remote.startedAt : 0;
          // Only advance if no one else has already advanced it.
          if (Date.now() - remoteStarted < QUESTION_DURATION_MS) return;
          const remoteHistory = Array.isArray(remote?.history) ? remote.history.slice(-HISTORY_SIZE) : [];
          const nextIndex = pickNextIndex(total, remoteHistory);
          const nextHistory = [...remoteHistory, nextIndex].slice(-HISTORY_SIZE);
          tx.set(ref, { index: nextIndex, startedAt: Date.now(), history: nextHistory });
        });
      } catch {
        /* another client likely won the race */
      } finally {
        // small cooldown so we don't spam if Firestore lags
        window.setTimeout(() => { advancingRef.current = false; }, 1500);
      }
    })();
  }, [now, state.startedAt, topic, total]);

  const question = cfg.questions[state.index] ?? cfg.questions[0];
  const msRemaining = Math.max(0, QUESTION_DURATION_MS - (now - state.startedAt));
  const secondsRemaining = Math.ceil(msRemaining / 1000);

  return {
    question,
    questionIndex: state.index,
    secondsRemaining,
    msRemaining,
    durationMs: QUESTION_DURATION_MS,
  };
}
