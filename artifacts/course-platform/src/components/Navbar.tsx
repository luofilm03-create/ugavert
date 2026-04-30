import { useState } from "react";
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

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const { user, updateUsername } = useUser();

  const activeTopic = TOPICS.find((t) => TOPIC_META[t].path === location) ?? "AI";

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
            <div className="search-wrap">
              <input className="glass-input nav-search" placeholder="Search topics..." />
              <svg className="search-icon" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
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
