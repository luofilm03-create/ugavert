import { useEffect, useState, useCallback } from "react";
import { ref, push, onValue, query, limitToLast, serverTimestamp } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import type { Topic } from "@/lib/topics";

export type ChatMessage = {
  id: string;
  username: string;
  uid: string;
  text: string;
  timestamp: number;
};

export function useChat(topic: Topic) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const chatRef = query(ref(rtdb, `chats/${topic.toLowerCase()}/messages`), limitToLast(60));
    const unsub = onValue(
      chatRef,
      (snap) => {
        const data = snap.val() as Record<string, Omit<ChatMessage, "id">> | null;
        if (data) {
          const msgs: ChatMessage[] = Object.entries(data)
            .map(([id, v]) => ({ id, ...v }))
            .sort((a, b) => a.timestamp - b.timestamp);
          setMessages(msgs);
        } else {
          setMessages([]);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [topic]);

  const sendMessage = useCallback(
    async (text: string, username: string, uid: string) => {
      if (!text.trim()) return;
      const chatRef = ref(rtdb, `chats/${topic.toLowerCase()}/messages`);
      await push(chatRef, {
        username: username.slice(0, 30),
        uid,
        text: text.trim().slice(0, 280),
        timestamp: serverTimestamp(),
      });
    },
    [topic]
  );

  return { messages, loading, error, sendMessage };
}
