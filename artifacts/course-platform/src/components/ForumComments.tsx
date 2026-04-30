import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { useUser } from "@/hooks/useUser";
import { InArticleAd } from "@/components/AdUnit";
import type { Topic } from "@/lib/topics";
import { TOPIC_META } from "@/lib/topics";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#06b6d4,#0e7490)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#10b981,#065f46)",
  "linear-gradient(135deg,#2563eb,#1e40af)",
  "linear-gradient(135deg,#ef4444,#b91c1c)",
  "linear-gradient(135deg,#7c3aed,#4c1d95)",
  "linear-gradient(135deg,#16a34a,#14532d)",
  "linear-gradient(135deg,#d97706,#92400e)",
];

function avatarGrad(uid: string) {
  let h = 0;
  for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

interface Props { topic: Topic; question: string; }

type Tab = "Discussion" | "Top Picks" | "Forum";

export default function ForumComments({ topic, question }: Props) {
  const { comments, loading, postComment, toggleVote } = useComments(topic);
  const { user } = useUser();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<Tab>("Discussion");
  const cfg = TOPIC_META[topic];

  const submit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try { await postComment(text.trim(), user.username, user.uid); setText(""); } catch { /* ignore */ }
    setSubmitting(false);
  };

  const sorted = tab === "Top Picks"
    ? [...comments].sort((a, b) => b.votes - a.votes)
    : [...comments].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="forum-wrap glass-card">
      {/* Tabs */}
      <div className="forum-tabs">
        {(["Discussion", "Top Picks", "Forum"] as Tab[]).map((t) => (
          <button
            key={t}
            className={`forum-tab ${tab === t ? "forum-tab-active" : "forum-tab-inactive"}`}
            style={tab === t ? { color: cfg.color, borderBottomColor: cfg.color } : {}}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
        <span className="forum-count">{loading ? "…" : comments.length} replies</span>
      </div>

      <div className="forum-body">
        {/* Comment box */}
        <div className="forum-compose">
          <div className="compose-avatar" style={{ background: avatarGrad(user.uid) }}>
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="compose-right">
            <textarea
              className="glass-input compose-input"
              rows={2}
              placeholder={`Share your take on: ${question}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              maxLength={800}
              disabled={submitting}
            />
            <div className="compose-actions">
              <span className="compose-char">{text.length}/800</span>
              <button
                className="glass-btn-gold compose-btn"
                onClick={submit}
                disabled={!text.trim() || submitting}
              >
                {submitting ? "Posting…" : "Post"}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Comment list */}
        {loading && <div className="forum-loading">Loading discussion…</div>}

        {!loading && sorted.length === 0 && (
          <div className="forum-empty">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-2 opacity-40">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}

        {sorted.map((c, idx) => {
          const hasVoted = c.upvotedBy.includes(user.uid);
          return (
            <div key={c.id}>
              {idx > 0 && idx % 4 === 0 && <InArticleAd />}
              <div className="forum-comment">
                <div className="comment-avatar-wrap" style={{ background: avatarGrad(c.uid) }}>
                  {c.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="comment-user">{c.uid === user.uid ? "You" : c.username}</span>
                    <span className={`badge ${cfg.badgeClass}`}>{topic}</span>
                    <span className="comment-time">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                  <div className="comment-actions">
                    <button
                      className={`vote-btn ${hasVoted ? "upvoted" : ""}`}
                      onClick={() => toggleVote(c.id, user.uid, hasVoted)}
                    >
                      <svg width="11" height="11" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                      </svg>
                      {c.votes}
                    </button>
                    <button className="reply-btn">Reply</button>
                    <button className="share-btn">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
