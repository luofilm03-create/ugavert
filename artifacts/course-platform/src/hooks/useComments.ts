import { useEffect, useState, useCallback } from "react";
import {
  collection, addDoc, onSnapshot, query, orderBy,
  doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp,
  increment, limit, getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Topic } from "@/lib/topics";

export type Comment = {
  id: string;
  username: string;
  uid: string;
  text: string;
  votes: number;
  upvotedBy: string[];
  createdAt: number;
  parentId: string | null;
};

export function useComments(topic: Topic) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "forums", topic.toLowerCase(), "comments");
    const q = query(colRef, orderBy("createdAt", "desc"), limit(200));
    const unsub = onSnapshot(q, (snap) => {
      const items: Comment[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          username: data.username ?? "Anonymous",
          uid: data.uid ?? "",
          text: data.text ?? "",
          votes: data.votes ?? 0,
          upvotedBy: data.upvotedBy ?? [],
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
          parentId: typeof data.parentId === "string" ? data.parentId : null,
        };
      });
      setComments(items);
      setLoading(false);
    });
    return () => unsub();
  }, [topic]);

  const postComment = useCallback(
    async (text: string, username: string, uid: string, parentId: string | null = null) => {
      if (!text.trim()) return;
      const colRef = collection(db, "forums", topic.toLowerCase(), "comments");
      await addDoc(colRef, {
        username: username.slice(0, 30),
        uid,
        text: text.trim().slice(0, 800),
        votes: 0,
        upvotedBy: [],
        createdAt: serverTimestamp(),
        parentId: parentId ?? null,
      });
    },
    [topic]
  );

  const toggleVote = useCallback(
    async (commentId: string, uid: string, hasVoted: boolean) => {
      const docRef = doc(db, "forums", topic.toLowerCase(), "comments", commentId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return;
      if (hasVoted) {
        await updateDoc(docRef, {
          votes: increment(-1),
          upvotedBy: arrayRemove(uid),
        });
      } else {
        await updateDoc(docRef, {
          votes: increment(1),
          upvotedBy: arrayUnion(uid),
        });
      }
    },
    [topic]
  );

  return { comments, loading, postComment, toggleVote };
}
