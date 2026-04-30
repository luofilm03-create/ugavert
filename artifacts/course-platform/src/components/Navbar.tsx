import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { TOPICS, TOPIC_META, type Topic } from "@/lib/topics";
import { useUser } from "@/hooks/useUser";

const TOPIC_ICONS: Record<Topic, React.ReactNode> = {
  AI: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/>
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/>
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none"/>
      <path d="M9 14s1 1 3 1 3-1 3-1"/>
    </svg>
  ),
  Crypto: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"/>
    </svg>
  ),
  Investment: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  Banking: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
    </svg>
  ),
};

type SearchResult =
  | { kind: "topic"; topic: Topic; label: string; sub: string }
  | { kind: "subtag"; topic: Topic; label: string; sub: string }
  | { kind: "question"; topic: Topic; label: string; sub: string };

const ALL_RESULTS: SearchResult[] = TOPICS.flatMap((t) => {
  const meta = TOPIC_META[t];
  const topic: SearchResult = { kind: "topic", topic: t, label: t, sub: `Browse ${t} discussions` };
  const subtags: SearchResult[] = meta.subtags.map((s) => ({
    kind: "subtag", topic: t, label: s, sub: `${t} · tag`,
  }));
  const questions: SearchResult[] = meta.questions.map((q) => ({
    kind: "question", topic: t, label: q, sub: `${t} · hot question`,
  }));
  return [topic, ...subtags, ...questions];
});

function scoreMatch(needle: string, hay: string): number {
  if (!needle) return 0;
  const n = needle.toLowerCase();
  const h = hay.toLowerCase();
  if (h === n) return 1000;
  if (h.startsWith(n)) return 500;
  const idx = h.indexOf(n);
  if (idx !== -1) return 200 - idx;
  // simple char-subsequence match
  let i = 0;
  for (const c of h) { if (c === n[i]) i++; if (i === n.length) return 50; }
  return 0;
}

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const { user, updateUsername } = useUser();

  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const activeTopic = TOPICS.find((t) => TOPIC_META[t].path === location) ?? "AI";

  const results = useMemo(() => {
    const q = searchText.trim();
    if (!q) return [];
    return ALL_RESULTS
      .map((r) => ({ r, score: Math.max(scoreMatch(q, r.label), scoreMatch(q, r.sub) - 50) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((x) => x.r);
  }, [searchText]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const goToResult = (r: SearchResult) => {
    setSearchOpen(false);
    setSearchText("");
    setLocation(TOPIC_META[r.topic].path);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen || results.length === 0) {
      if (e.key === "Enter" && searchText.trim()) {
        // No matches; try to land on a topic if user typed one of them
        const direct = TOPICS.find((t) => t.toLowerCase() === searchText.trim().toLowerCase());
        if (direct) { setLocation(TOPIC_META[direct].path); setSearchOpen(false); setSearchText(""); }
      }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => (i + 1) % results.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => (i - 1 + results.length) % results.length); }
    else if (e.key === "Enter") { e.preventDefault(); goToResult(results[activeIndex]); }
    else if (e.key === "Escape") { setSearchOpen(false); }
  };

  useEffect(() => { setActiveIndex(0); }, [searchText]);

  const saveUsername = () => {
    if (nameInput.trim()) { updateUsername(nameInput.trim()); }
    setShowEdit(false);
    setNameInput("");
  };

  return (
    <>
      <nav className="glass-nav sticky top-0 z-50">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/ai" className="logo-wrap">
            <div className="logo-icon">
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="logo-text">UGAVERT</span>
          </Link>

          {/* Desktop nav */}
          <div className="desktop-nav">
            {TOPICS.map((t) => (
              <Link key={t} href={TOPIC_META[t].path}>
                <button className={`nav-link ${activeTopic === t ? "nav-link-active" : ""}`}
                  style={activeTopic === t ? { color: TOPIC_META[t].color, borderBottomColor: TOPIC_META[t].color } : {}}
                >
                  <span className="nav-icon">{TOPIC_ICONS[t]}</span>
                  <span>{t}</span>
                </button>
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="nav-right">
            <div className="search-wrap" ref={searchWrapRef}>
              <input
                className="glass-input nav-search"
                placeholder="Search topics, tags, questions..."
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={onSearchKeyDown}
              />
              <svg className="search-icon" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>

              {searchOpen && results.length > 0 && (
                <div className="search-dropdown">
                  {results.map((r, i) => {
                    const meta = TOPIC_META[r.topic];
                    return (
                      <button
                        key={`${r.kind}-${r.topic}-${r.label}-${i}`}
                        className={`search-result ${i === activeIndex ? "search-result-active" : ""}`}
                        onMouseEnter={() => setActiveIndex(i)}
                        onMouseDown={(e) => { e.preventDefault(); goToResult(r); }}
                      >
                        <span className="search-result-icon" style={{ color: meta.color, background: meta.color + "15" }}>
                          {TOPIC_ICONS[r.topic]}
                        </span>
                        <span className="search-result-text">
                          <span className="search-result-label">{r.label}</span>
                          <span className="search-result-sub">{r.sub}</span>
                        </span>
                        <span className="search-result-kind">{r.kind}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {searchOpen && searchText.trim() && results.length === 0 && (
                <div className="search-dropdown">
                  <div className="search-empty">No matches for "{searchText}"</div>
                </div>
              )}
            </div>

            <button className="user-btn" onClick={() => { setShowEdit(true); setNameInput(user.username); }}>
              <div className="user-avatar">{user.username.slice(0, 2).toUpperCase()}</div>
              <span className="user-name hidden md:block">{user.username}</span>
            </button>

            {/* Hamburger */}
            <button className="hamburger md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen
                ? <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                : <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            {TOPICS.map((t) => (
              <Link key={t} href={TOPIC_META[t].path}>
                <button
                  className={`mobile-nav-link ${activeTopic === t ? "mobile-nav-active" : ""}`}
                  style={activeTopic === t ? { color: TOPIC_META[t].color } : {}}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{TOPIC_ICONS[t]}</span>
                  <span>{t}</span>
                </button>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Username edit modal */}
      {showEdit && (
        <div className="modal-backdrop" onClick={() => setShowEdit(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Your Display Name</h3>
            <p className="modal-sub">Used in chat and forum posts</p>
            <input
              className="glass-input modal-input"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name..."
              maxLength={24}
              onKeyDown={(e) => e.key === "Enter" && saveUsername()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="glass-btn modal-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
              <button className="glass-btn-gold modal-save" onClick={saveUsername}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
