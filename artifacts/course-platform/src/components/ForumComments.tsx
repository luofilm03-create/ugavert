import { useMemo, useState } from "react";
import { useComments, type Comment } from "@/hooks/useComments";
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

interface CommentRowProps {
  c: Comment;
  topic: Topic;
  meUid: string;
  meUsername: string;
  isReply?: boolean;
  replies?: Comment[];
  onVote: (id: string, hasVoted: boolean) => void;
  onReply: (parentId: string, text: string) => Promise<void>;
}

function CommentRow({ c, topic, meUid, meUsername, isReply, replies, onVote, onReply }: CommentRowProps) {
  const cfg = TOPIC_META[topic];
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const hasVoted = c.upvotedBy.includes(meUid);

  const submit = async () => {
    if (!replyText.trim() || submittingReply) return;
    setSubmittingReply(true);
    try { await onReply(c.id, replyText.trim()); setReplyText(""); setReplyOpen(false); }
    catch { /* ignore */ }
    setSubmittingReply(false);
  };

  return (
    <div className={`forum-comment ${isReply ? "forum-comment-reply" : ""}`}>
      <div className="comment-avatar-wrap" style={{ background: avatarGrad(c.uid) }}>
        {c.username.slice(0, 2).toUpperCase()}
      </div>
      <div className="comment-body">
        <div className="comment-meta">
          <span className="comment-user">{c.uid === meUid ? "You" : c.username}</span>
          {!isReply && <span className={`badge ${cfg.badgeClass}`}>{topic}</span>}
          <span className="comment-time">{timeAgo(c.createdAt)}</span>
        </div>
        <p className="comment-text">{c.text}</p>
        <div className="comment-actions">
          <button
            className={`vote-btn ${hasVoted ? "upvoted" : ""}`}
            onClick={() => onVote(c.id, hasVoted)}
          >
            <svg width="11" height="11" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            {c.votes}
          </button>
          <button className="reply-btn" onClick={() => setReplyOpen((v) => !v)}>
            {replyOpen ? "Cancel" : `Reply${replies && replies.length ? ` · ${replies.length}` : ""}`}
          </button>
          <button
            className="share-btn"
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}#c-${c.id}`;
              if (navigator.clipboard) void navigator.clipboard.writeText(url);
            }}
          >
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Share
          </button>
        </div>

        {replyOpen && (
          <div className="reply-compose">
            <textarea
              className="glass-input reply-input"
              rows={2}
              placeholder={`Reply to ${c.username}…`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(); } }}
              maxLength={800}
              disabled={submittingReply}
              autoFocus
            />
            <div className="reply-compose-actions">
              <span className="reply-compose-hint">Replying as {meUsername}</span>
              <button
                className="glass-btn-gold reply-submit"
                onClick={submit}
                disabled={submittingReply || !replyText.trim()}
              >
                {submittingReply ? "Posting…" : "Post reply"}
              </button>
            </div>
          </div>
        )}

        {replies && replies.length > 0 && (
          <div className="forum-reply-list">
            {replies.map((r) => (
              <CommentRow
                key={r.id}
                c={r}
                topic={topic}
                meUid={meUid}
                meUsername={meUsername}
                isReply
                onVote={onVote}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
    try { await postComment(text.trim(), user.username, user.uid, null); setText(""); } catch { /* ignore */ }
    setSubmitting(false);
  };

  const onReply = async (parentId: string, body: string) => {
    await postComment(body, user.username, user.uid, parentId);
  };

  // Group replies under their parents for the Forum (threaded) view
  const { topLevel, repliesByParent } = useMemo(() => {
    const tops: Comment[] = [];
    const map = new Map<string, Comment[]>();
    for (const c of comments) {
      if (c.parentId) {
        const arr = map.get(c.parentId) ?? [];
        arr.push(c); map.set(c.parentId, arr);
      } else { tops.push(c); }
    }
    // Replies oldest first under each parent
    for (const [k, v] of map) map.set(k, [...v].sort((a, b) => a.createdAt - b.createdAt));
    return { topLevel: tops, repliesByParent: map };
  }, [comments]);

  const flatSorted: Comment[] = useMemo(() => {
    if (tab === "Top Picks") return [...comments].sort((a, b) => b.votes - a.votes);
    return [...comments].sort((a, b) => b.createdAt - a.createdAt);
  }, [comments, tab]);

  const threaded: Comment[] = useMemo(() => {
    return [...topLevel].sort((a, b) => b.createdAt - a.createdAt);
  }, [topLevel]);

  const totalCount = comments.length;

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
        <span className="forum-count">{loading ? "…" : totalCount} replies</span>
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
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void submit(); } }}
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

        {!loading && totalCount === 0 && (
          <div className="forum-empty">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-2 opacity-40">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}

        {/* Discussion / Top Picks (flat) */}
        {!loading && totalCount > 0 && tab !== "Forum" && flatSorted.map((c, idx) => (
          <div key={c.id} id={`c-${c.id}`}>
            {idx > 0 && idx % 4 === 0 && <InArticleAd />}
            <CommentRow
              c={c}
              topic={topic}
              meUid={user.uid}
              meUsername={user.username}
              onVote={(id, hasVoted) => void toggleVote(id, user.uid, hasVoted)}
              onReply={onReply}
            />
          </div>
        ))}

        {/* Forum (threaded — parents only, with replies nested) */}
        {!loading && totalCount > 0 && tab === "Forum" && threaded.map((c, idx) => (
          <div key={c.id} id={`c-${c.id}`}>
            {idx > 0 && idx % 4 === 0 && <InArticleAd />}
            <CommentRow
              c={c}
              topic={topic}
              meUid={user.uid}
              meUsername={user.username}
              replies={repliesByParent.get(c.id) ?? []}
              onVote={(id, hasVoted) => void toggleVote(id, user.uid, hasVoted)}
              onReply={onReply}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
