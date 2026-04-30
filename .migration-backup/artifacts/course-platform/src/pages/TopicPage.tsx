import { useState, useEffect, useRef } from "react";
import { TOPIC_META, getTopicQuestion, type Topic } from "@/lib/topics";
import { DisplayAd, LeaderboardAd } from "@/components/AdUnit";
import ForumComments from "@/components/ForumComments";
import LiveChat from "@/components/LiveChat";

const AD_DURATION = 30;

interface Props { topic: Topic; }

export default function TopicPage({ topic }: Props) {
  const cfg = TOPIC_META[topic];
  const [question] = useState(() => getTopicQuestion(topic));
  const [activeTag, setActiveTag] = useState<string>("");
  const [adIndex, setAdIndex] = useState(0);
  const [adProgress, setAdProgress] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [nextChange, setNextChange] = useState("");

  // Ad auto-advance
  useEffect(() => {
    setAdProgress(0);
    timerRef.current && clearInterval(timerRef.current);
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 1;
      const pct = Math.min((elapsed / AD_DURATION) * 100, 100);
      setAdProgress(pct);
      if (elapsed >= AD_DURATION) {
        elapsed = 0;
        setAdIndex((i) => (i + 1) % cfg.adLabels.length);
        setAdProgress(0);
      }
    }, 1000);
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, [adIndex, cfg.adLabels.length, topic]);

  // Countdown to next question
  useEffect(() => {
    const tick = () => {
      const msIn12h = 12 * 3600 * 1000;
      const remaining = msIn12h - (Date.now() % msIn12h);
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      setNextChange(`${h}h ${m}m`);
    };
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, []);

  const prevAd = () => setAdIndex((i) => (i - 1 + cfg.adLabels.length) % cfg.adLabels.length);
  const nextAd = () => setAdIndex((i) => (i + 1) % cfg.adLabels.length);

  return (
    <div className="page-wrap">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="page-inner">
        {/* Leaderboard ad — top of page */}
        <div className="top-ad-bar">
          <LeaderboardAd />
        </div>

        {/* Subtag row */}
        <div className="tag-row">
          <span className={`badge ${cfg.badgeClass}`} style={{ color: cfg.color, borderColor: cfg.color + "55" }}>
            {topic}
          </span>
          {cfg.subtags.map((tag) => (
            <button
              key={tag}
              className={`glass-tag ${activeTag === tag ? "active" : ""}`}
              style={activeTag === tag ? { background: cfg.color + "22", borderColor: cfg.color + "88", color: cfg.color } : {}}
              onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="main-cols">

          {/* ── LEFT / MAIN ── */}
          <div className="main-col">

            {/* QUESTION BANNER */}
            <div className="question-banner glass-question" key={`${topic}-${question}`}>
              <div className="question-icon" style={{ background: cfg.color + "22", color: cfg.color }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="question-body">
                <p className="question-label" style={{ color: cfg.color }}>
                  Hot Question · {topic} · Refreshes in {nextChange}
                </p>
                <h2 className="question-text">{question}</h2>
                <p className="question-hint">Drop your answer in the discussion below ↓</p>
              </div>
            </div>

            {/* AD DISPLAY AREA */}
            <div className="ad-panel glass-card">
              {/* Ad header bar */}
              <div className="ad-panel-header">
                <span className="ad-sponsored-label">Sponsored</span>
                <div className="ad-dots">
                  {cfg.adLabels.map((_, i) => (
                    <button
                      key={i}
                      className="ad-dot"
                      style={{ background: i === adIndex ? cfg.color : "rgba(180,150,60,0.25)", transform: i === adIndex ? "scale(1.3)" : "scale(1)" }}
                      onClick={() => setAdIndex(i)}
                    />
                  ))}
                </div>
                <span className="ad-count">{adIndex + 1}/{cfg.adLabels.length}</span>
              </div>

              {/* Timer bar */}
              <div className="ad-timer-track">
                <div className="ad-timer-fill" style={{ width: `${adProgress}%`, background: cfg.color }} />
              </div>

              {/* Ad content */}
              <div className="ad-content-area">
                <DisplayAd label={cfg.adLabels[adIndex]} />
              </div>

              {/* Controls */}
              <div className="ad-controls">
                <button className="glass-btn ad-prev-btn" onClick={prevAd}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M15 19l-7-7 7-7"/></svg>
                  Previous
                </button>
                <div className="ad-center-info">
                  <p className="ad-current-label">{cfg.adLabels[adIndex]}</p>
                  <p className="ad-timer-text">
                    Auto-advances in {Math.ceil(AD_DURATION - (adProgress / 100) * AD_DURATION)}s
                  </p>
                </div>
                <button className="glass-btn-gold ad-next-btn" onClick={nextAd}>
                  Next
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            {/* FORUM / COMMENTS */}
            <ForumComments topic={topic} question={question} />

          </div>

          {/* ── RIGHT / LIVE CHAT (desktop) ── */}
          <div className="chat-col">
            <div className="chat-sticky">
              <LiveChat topic={topic} />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile floating chat button */}
      <button
        className="mobile-chat-fab"
        style={{ background: cfg.color }}
        onClick={() => setChatOpen(true)}
      >
        <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="live-dot mobile-fab-dot" />
      </button>

      {/* Mobile chat drawer */}
      {chatOpen && (
        <div className="mobile-chat-drawer">
          <div className="mobile-chat-backdrop" onClick={() => setChatOpen(false)} />
          <div className="mobile-chat-sheet">
            <LiveChat topic={topic} onClose={() => setChatOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
