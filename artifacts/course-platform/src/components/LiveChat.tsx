import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";
import { usePresence } from "@/hooks/usePresence";
import type { Topic } from "@/lib/topics";

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

function avatarColor(uid: string) {
  let h = 0;
  for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return "now";
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  return `${Math.floor(s / 3600)}h`;
}

interface LiveChatProps { topic: Topic; onClose?: () => void; }

export default function LiveChat({ topic, onClose }: LiveChatProps) {
  const { messages, loading, sendMessage } = useChat(topic);
  const { user } = useUser();
  const onlineCount = usePresence(topic, user.uid);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const txt = input.trim();
    if (!txt || sending) return;
    setSending(true);
    setInput("");
    try { await sendMessage(txt, user.username, user.uid); } catch { /* ignore */ }
    setSending(false);
  };

  return (
    <div className="chat-panel">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="live-dot" />
          <span className="chat-title">Live Chat</span>
        </div>
        <div className="chat-header-right">
          <span className="chat-online">{onlineCount} online</span>
          {onClose && (
            <button className="chat-close" onClick={onClose}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages scroll-custom">
        {loading && (
          <div className="chat-loading">
            <span className="chat-loading-dot" /> <span className="chat-loading-dot" /> <span className="chat-loading-dot" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="chat-empty">Be the first to say something!</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`chat-msg ${m.uid === user.uid ? "chat-msg-own" : ""}`}>
            <div
              className="chat-msg-avatar"
              style={{ background: avatarColor(m.uid) }}
              title={m.username}
            >
              {m.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="chat-msg-body">
              <div className="chat-msg-meta">
                <span className="chat-msg-user">{m.uid === user.uid ? "You" : m.username}</span>
                <span className="chat-msg-time">{timeAgo(m.timestamp)}</span>
              </div>
              <p className="chat-msg-text">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="glass-input chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          maxLength={280}
          disabled={sending}
        />
        <button className="chat-send glass-btn-gold" onClick={send} disabled={sending || !input.trim()}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
