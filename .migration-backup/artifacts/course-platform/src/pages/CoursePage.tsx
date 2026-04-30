import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   TOPIC DATA
───────────────────────────────────────────────────────── */
const TOPICS = ["AI", "Crypto", "Investment", "Banking"] as const;
type Topic = (typeof TOPICS)[number];

const TOPIC_CONFIG: Record<Topic, {
  color: string; badge: string; icon: string;
  questions: string[];
  adLabels: string[];
  subtags: string[];
}> = {
  AI: {
    color: "#7c3aed", badge: "badge-ai", icon: "🤖",
    subtags: ["#VibeCode", "#LLMs", "#ChatGPT", "#Gemini", "#Cursor", "#Claude", "#Design"],
    questions: [
      "WHICH AI PLATFORM IS BEST FOR VIBE CODING?",
      "BEST AI FOR WEBSITE & APP DESIGNING?",
      "WHICH AI IMAGE GENERATOR IS MOST POWERFUL?",
      "CHATGPT VS CLAUDE VS GEMINI — WHO WINS?",
      "CAN AI REPLACE DEVELOPERS IN 2025?",
      "BEST AI CODING ASSISTANT RIGHT NOW?",
      "WHICH AI WRITES THE CLEANEST CODE?",
    ],
    adLabels: ["AI Tools & Platforms", "Code with AI", "AI Productivity Suite", "Smart AI Assistant"],
  },
  Crypto: {
    color: "#d97706", badge: "badge-crypto", icon: "₿",
    subtags: ["#Bitcoin", "#Ethereum", "#DeFi", "#NFTs", "#Altcoins", "#Staking", "#Web3"],
    questions: [
      "WHICH CRYPTOCURRENCY WILL DOMINATE IN 2025?",
      "IS BITCOIN STILL THE KING OF CRYPTO?",
      "DEFI OR CEFI — WHICH IS SAFER FOR INVESTMENT?",
      "BEST CRYPTO EXCHANGE PLATFORM RIGHT NOW?",
      "SHOULD YOU STAKE YOUR CRYPTO HOLDINGS?",
      "ETHEREUM VS SOLANA — WHICH HAS MORE FUTURE?",
      "HOW TO IDENTIFY THE NEXT 100X ALTCOIN?",
    ],
    adLabels: ["Top Crypto Exchange", "Secure Your Bitcoin", "DeFi Yield Platform", "Crypto Portfolio Tracker"],
  },
  Investment: {
    color: "#16a34a", badge: "badge-invest", icon: "📈",
    subtags: ["#Stocks", "#ETFs", "#RealEstate", "#Dividends", "#Passive", "#Portfolio", "#Options"],
    questions: [
      "STOCKS VS CRYPTO — WHERE TO PUT YOUR MONEY?",
      "BEST INVESTMENT STRATEGY FOR BEGINNERS IN 2025?",
      "IS REAL ESTATE STILL WORTH IT THIS YEAR?",
      "INDEX FUNDS VS INDIVIDUAL STOCKS — WHICH WINS?",
      "HOW TO BUILD PASSIVE INCOME THAT LASTS?",
      "WHAT IS THE SAFEST HIGH-YIELD INVESTMENT?",
      "DIVIDEND STOCKS OR GROWTH STOCKS — YOUR PICK?",
    ],
    adLabels: ["Smart Investment App", "Stock Market Signals", "Real Estate Platform", "Portfolio Manager Pro"],
  },
  Banking: {
    color: "#1d4ed8", badge: "badge-bank", icon: "🏦",
    subtags: ["#NeoBank", "#Savings", "#Loans", "#FinTech", "#BNPL", "#CreditCard", "#Swift"],
    questions: [
      "BEST DIGITAL BANK IN 2025 — YOUR VOTE?",
      "TRADITIONAL BANK VS NEOBANK — WHICH IS BETTER?",
      "HOW TO MAXIMIZE YOUR SAVINGS INTEREST RATE?",
      "BEST CREDIT CARD FOR CASHBACK REWARDS?",
      "IS YOUR MONEY ACTUALLY SAFE IN A DIGITAL BANK?",
      "WHICH FINTECH IS DISRUPTING BANKING THE MOST?",
      "BNPL VS CREDIT CARD — WHICH SHOULD YOU USE?",
    ],
    adLabels: ["Open a Digital Account", "Zero-Fee Banking", "High-Yield Savings", "Best Credit Card Offer"],
  },
};

/* ─────────────────────────────────────────────────────────
   MOCK COMMENTS (per topic, unique)
───────────────────────────────────────────────────────── */
const MOCK_COMMENTS: Record<Topic, Array<{ id: number; user: string; initials: string; grad: string; time: string; text: string; votes: number }>> = {
  AI: [
    { id: 1, user: "Alex M.", initials: "AM", grad: "linear-gradient(135deg,#8b5cf6,#6d28d9)", time: "2 min ago", text: "Cursor AI has literally changed how I build apps. The vibe coding workflow is insane — I shipped a SaaS in a weekend!", votes: 47 },
    { id: 2, user: "Sara K.", initials: "SK", grad: "linear-gradient(135deg,#ec4899,#be185d)", time: "8 min ago", text: "Claude 3.5 Sonnet is still my go-to for design work. It understands context way better than GPT for UI generation.", votes: 31 },
    { id: 3, user: "Dev Pro", initials: "DP", grad: "linear-gradient(135deg,#06b6d4,#0e7490)", time: "15 min ago", text: "Gemini 1.5 Flash is underrated for quick iterations. Free tier is generous too.", votes: 19 },
    { id: 4, user: "Jamie T.", initials: "JT", grad: "linear-gradient(135deg,#f59e0b,#d97706)", time: "22 min ago", text: "Copilot + Cursor combo is unmatched for coding. Nothing else comes close for real-world dev work.", votes: 24 },
  ],
  Crypto: [
    { id: 1, user: "Satoshi_Fan", initials: "SF", grad: "linear-gradient(135deg,#f59e0b,#d97706)", time: "1 min ago", text: "BTC is down 8% today but long-term holders aren't worried. This is just normal volatility. HODL.", votes: 62 },
    { id: 2, user: "ETH_Maxi", initials: "EM", grad: "linear-gradient(135deg,#6366f1,#4338ca)", time: "5 min ago", text: "Ethereum's staking yield is compelling. 4-5% APY while holding an asset with real utility — beats most savings accounts.", votes: 38 },
    { id: 3, user: "DeFi_Dave", initials: "DD", grad: "linear-gradient(135deg,#10b981,#065f46)", time: "11 min ago", text: "Solana is eating Ethereum's lunch on transaction fees. The ecosystem is growing fast.", votes: 27 },
    { id: 4, user: "CryptoCarla", initials: "CC", grad: "linear-gradient(135deg,#ef4444,#b91c1c)", time: "18 min ago", text: "Never put more than 5% of your portfolio in any single altcoin. Diversification is still king.", votes: 45 },
  ],
  Investment: [
    { id: 1, user: "Warren B.", initials: "WB", grad: "linear-gradient(135deg,#16a34a,#14532d)", time: "3 min ago", text: "VOO and chill. S&P 500 index funds beat 90% of active managers over 10 years. Stop overcomplicating it.", votes: 88 },
    { id: 2, user: "RealEstate_R", initials: "RR", grad: "linear-gradient(135deg,#0891b2,#164e63)", time: "9 min ago", text: "Real estate cash flow is still unbeatable if you buy in the right market. Leverage amplifies everything.", votes: 42 },
    { id: 3, user: "Dividend_D", initials: "DD", grad: "linear-gradient(135deg,#d97706,#92400e)", time: "14 min ago", text: "Dividend reinvestment (DRIP) over 20 years is genuinely life-changing. Start early, let compounding do its thing.", votes: 55 },
    { id: 4, user: "Options_O", initials: "OO", grad: "linear-gradient(135deg,#7c3aed,#4c1d95)", time: "25 min ago", text: "Covered calls on my ETF holdings generate an extra 1-2% monthly. Low risk, consistent income.", votes: 29 },
  ],
  Banking: [
    { id: 1, user: "FinTech_F", initials: "FF", grad: "linear-gradient(135deg,#2563eb,#1e40af)", time: "4 min ago", text: "Revolut Premium is worth every penny if you travel internationally. Zero FX fees alone save me hundreds a year.", votes: 53 },
    { id: 2, user: "SavingsKing", initials: "SK", grad: "linear-gradient(135deg,#16a34a,#14532d)", time: "10 min ago", text: "Marcus by Goldman Sachs still offers one of the best HYSA rates with no fees. Been using it 3 years.", votes: 36 },
    { id: 3, user: "CashBack_C", initials: "CC", grad: "linear-gradient(135deg,#dc2626,#991b1b)", time: "17 min ago", text: "Chase Sapphire Reserve + Freedom Flex combo is unbeatable for travel rewards + everyday cashback.", votes: 41 },
    { id: 4, user: "NoFees_N", initials: "NN", grad: "linear-gradient(135deg,#0891b2,#0e4060)", time: "28 min ago", text: "Traditional banks charging $15/month maintenance fees in 2025 is criminal. Switch to a neobank already.", votes: 67 },
  ],
};

/* ─────────────────────────────────────────────────────────
   MOCK LIVE CHAT MESSAGES
───────────────────────────────────────────────────────── */
const LIVE_CHAT_POOL: Record<Topic, string[]> = {
  AI: [
    "Cursor AI is 🔥 right now",
    "Anyone tried Windsurf IDE?",
    "Claude is better for long context imo",
    "GPT-4o is still my daily driver",
    "Gemini Flash is surprisingly fast",
    "Replit Agent just built me a full app 😱",
    "Claude for writing, GPT for code",
    "Perplexity > Google for research now",
    "Anyone tried Devin?",
    "AI will replace junior devs by 2026 fr",
  ],
  Crypto: [
    "BTC $100k end of year? 🚀",
    "ETH staking is passive income goals",
    "SOL is so undervalued rn",
    "DYOR always, never trust CT blindly",
    "DCA every week, never stop",
    "This dip is a buying opportunity",
    "Binance or Coinbase for beginners?",
    "Cold wallet or you don't own your crypto",
    "BRC-20 tokens are making moves",
    "LN payments are becoming mainstream",
  ],
  Investment: [
    "VTSAX and chill forever 🛋️",
    "Real estate beats everything long term",
    "Anyone doing covered calls here?",
    "Roth IRA maxed for 2025 ✅",
    "Dollar cost average, don't time the market",
    "SCHD dividend growth is consistent",
    "3-fund portfolio is underrated",
    "Emergency fund first, invest second",
    "Which brokerage do you use?",
    "Index funds beat hedge funds 90% of the time",
  ],
  Banking: [
    "Revolut Premium is worth it 💳",
    "Marcus HYSA hitting 4.5% APY",
    "Traditional banks are dinosaurs",
    "Chase Sapphire points are 🔑",
    "Wise for international transfers!",
    "Is Chime reliable long term?",
    "FDIC insured = sleep well at night",
    "No fee banking should be standard",
    "Credit union > big bank always",
    "Apple Card is genuinely good for cashback",
  ],
};

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function getTopicFromStorage(): Topic {
  try {
    const stored = localStorage.getItem("finai_topic_data");
    if (stored) {
      const { topic, timestamp } = JSON.parse(stored) as { topic: Topic; timestamp: number };
      const elapsed = Date.now() - timestamp;
      if (elapsed < 12 * 60 * 60 * 1000) return topic;
    }
  } catch { /* ignore */ }
  const topic = TOPICS[Math.floor(Date.now() / (12 * 60 * 60 * 1000)) % TOPICS.length];
  localStorage.setItem("finai_topic_data", JSON.stringify({ topic, timestamp: Date.now() }));
  return topic;
}

function getQuestionFromStorage(topic: Topic): string {
  try {
    const stored = localStorage.getItem(`finai_q_${topic}`);
    if (stored) {
      const { question, timestamp } = JSON.parse(stored) as { question: string; timestamp: number };
      if (Date.now() - timestamp < 12 * 60 * 60 * 1000) return question;
    }
  } catch { /* ignore */ }
  const questions = TOPIC_CONFIG[topic].questions;
  const q = questions[Math.floor(Date.now() / (12 * 60 * 60 * 1000)) % questions.length];
  localStorage.setItem(`finai_q_${topic}`, JSON.stringify({ question: q, timestamp: Date.now() }));
  return q;
}

/* ─────────────────────────────────────────────────────────
   AD SLOT COMPONENT
───────────────────────────────────────────────────────── */
function AdSlot({ slotLabel, index }: { slotLabel: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to push AdSense ad
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      if (w.adsbygoogle) {
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      }
    } catch { /* ignore if adsbygoogle not ready */ }
  }, [index]);

  return (
    <div ref={ref} className="w-full flex flex-col items-center justify-center" style={{ minHeight: 260 }}>
      {/* Real AdSense unit — will load if approved */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: 250 }}
        data-ad-client="ca-pub-4036391133460180"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {/* Fallback visual shown while waiting for AdSense approval */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-md"
          style={{ background: "linear-gradient(135deg,rgba(210,162,28,0.85),rgba(160,115,10,0.90))" }}
        >
          📢 Advertisement
        </div>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(110,85,20,0.5)" }}>
          {slotLabel} — Ad Slot {index + 1}
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(100,75,15,0.38)" }}>
          Powered by Google AdSense · ca-pub-4036391133460180
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LIVE CHAT
───────────────────────────────────────────────────────── */
function LiveChat({ topic }: { topic: Topic }) {
  const pool = LIVE_CHAT_POOL[topic];
  const users = ["Alex_M", "Sara_K", "DevPro", "Jamie_T", "Crypto_C", "FinGuru", "WenMoon", "TechLead", "PedroCR", "K8_Dev"];
  const grads = [
    "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    "linear-gradient(135deg,#ec4899,#be185d)",
    "linear-gradient(135deg,#06b6d4,#0e7490)",
    "linear-gradient(135deg,#f59e0b,#d97706)",
    "linear-gradient(135deg,#10b981,#065f46)",
    "linear-gradient(135deg,#2563eb,#1e40af)",
    "linear-gradient(135deg,#ef4444,#b91c1c)",
    "linear-gradient(135deg,#d97706,#92400e)",
    "linear-gradient(135deg,#7c3aed,#4c1d95)",
    "linear-gradient(135deg,#16a34a,#14532d)",
  ];

  type ChatMsg = { id: number; user: string; grad: string; text: string; ts: number };

  const seed = useRef<ChatMsg[]>(() => {
    return pool.slice(0, 6).map((text, i) => ({
      id: i,
      user: users[i % users.length],
      grad: grads[i % grads.length],
      text,
      ts: Date.now() - (6 - i) * 18000,
    }));
  }).current as unknown as ChatMsg[];

  const [messages, setMessages] = useState<ChatMsg[]>(
    pool.slice(0, 6).map((text, i) => ({
      id: i, user: users[i % users.length], grad: grads[i % grads.length],
      text, ts: Date.now() - (6 - i) * 18000,
    }))
  );
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(100);

  useEffect(() => {
    const timer = setInterval(() => {
      const ri = Math.floor(Math.random() * pool.length);
      const ui = Math.floor(Math.random() * users.length);
      setMessages((prev) => {
        const next = [...prev, { id: counterRef.current++, user: users[ui], grad: grads[ui], text: pool[ri], ts: Date.now() }];
        return next.slice(-30);
      });
    }, 5000 + Math.random() * 4000);
    return () => clearInterval(timer);
  }, [topic]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  void seed;

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: counterRef.current++, user: "You", grad: "linear-gradient(135deg,#c8960e,#8a6205)", text: input.trim(), ts: Date.now() }].slice(-30));
    setInput("");
  };

  const fmt = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 10) return "just now";
    if (s < 60) return `${s}s ago`;
    return `${Math.floor(s / 60)}m ago`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-4 pt-4">
        <div className="live-dot" />
        <span className="text-sm font-bold text-stone-700">Live Chat</span>
        <span className="ml-auto text-xs text-stone-400">{messages.length} online</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-custom px-3 flex flex-col gap-2 pb-2">
        {messages.map((m) => (
          <div key={m.id} className="glass-chat-msg">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: m.grad }} />
              <span className="font-semibold text-stone-700 text-[0.72rem]">{m.user}</span>
              <span className="text-stone-400 text-[0.65rem] ml-auto">{fmt(m.ts)}</span>
            </div>
            <p className="text-stone-600 leading-snug">{m.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-4 pt-2 flex gap-2">
        <input
          className="glass-input flex-1 rounded-full text-xs px-3 py-2"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMsg()}
        />
        <button
          onClick={sendMsg}
          className="glass-btn-gold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-white"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function CoursePage() {
  const [topic, setTopic] = useState<Topic>(getTopicFromStorage);
  const [question, setQuestion] = useState(() => getQuestionFromStorage(getTopicFromStorage()));
  const [activeTag, setActiveTag] = useState<string>("");
  const [adIndex, setAdIndex] = useState(0);
  const [adTimer, setAdTimer] = useState(0); // 0-100
  const AD_DURATION = 30; // seconds per ad
  const [forumTab, setForumTab] = useState<"Discussion" | "Forum" | "Top Picks">("Discussion");
  const [comments, setComments] = useState(MOCK_COMMENTS[topic]);
  const [commentInput, setCommentInput] = useState("");
  const [voted, setVoted] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const config = TOPIC_CONFIG[topic];
  const adLabels = config.adLabels;

  // Auto-advance ads
  useEffect(() => {
    setAdTimer(0);
    timerRef.current && clearInterval(timerRef.current);
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 1;
      setAdTimer(Math.min((elapsed / AD_DURATION) * 100, 100));
      if (elapsed >= AD_DURATION) {
        elapsed = 0;
        setAdIndex((i) => (i + 1) % adLabels.length);
        setAdTimer(0);
      }
    }, 1000);
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, [adIndex, adLabels.length, topic]);

  // Switch topic
  const switchTopic = (t: Topic) => {
    setTopic(t);
    setQuestion(getQuestionFromStorage(t));
    setActiveTag("");
    setComments(MOCK_COMMENTS[t]);
    setAdIndex(0);
    setAdTimer(0);
    setVoted({});
    localStorage.setItem("finai_topic_data", JSON.stringify({ topic: t, timestamp: Date.now() }));
  };

  const prevAd = () => setAdIndex((i) => (i - 1 + adLabels.length) % adLabels.length);
  const nextAd = () => setAdIndex((i) => (i + 1) % adLabels.length);

  const postComment = () => {
    if (!commentInput.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(), user: "You", initials: "YO",
        grad: "linear-gradient(135deg,#c8960e,#8a6205)",
        time: "just now", text: commentInput.trim(), votes: 0,
      },
      ...prev,
    ]);
    setCommentInput("");
  };

  const toggleVote = useCallback((id: number) => {
    setVoted((prev) => ({ ...prev, [id]: !prev[id] }));
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, votes: c.votes + (voted[id] ? -1 : 1) } : c));
  }, [voted]);

  // 12-hr countdown display
  const [nextChange, setNextChange] = useState("");
  useEffect(() => {
    const tick = () => {
      try {
        const stored = localStorage.getItem("finai_topic_data");
        if (stored) {
          const { timestamp } = JSON.parse(stored) as { timestamp: number };
          const remaining = 12 * 3600 * 1000 - (Date.now() - timestamp);
          if (remaining > 0) {
            const h = Math.floor(remaining / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            setNextChange(`${h}h ${m}m`);
          }
        }
      } catch { /* ignore */ }
    };
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, [topic]);

  return (
    <div className="relative min-h-screen">
      {/* Ambient orbs */}
      <div className="warm-orb warm-orb-1" />
      <div className="warm-orb warm-orb-2" />
      <div className="warm-orb warm-orb-3" />

      {/* ─── NAVBAR ─── */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black" style={{ background: "linear-gradient(135deg,#d4a018,#8a6205)" }}>
              F
            </div>
            <span className="font-bold text-base text-stone-800 hidden sm:block">FinAI Hub</span>
          </div>

          {/* Topic nav */}
          <div className="flex items-center gap-1">
            {TOPICS.map((t) => (
              <button key={t} className={`glass-btn-nav flex items-center gap-1.5 ${topic === t ? "active" : ""}`} onClick={() => switchTopic(t)}>
                <span>{TOPIC_CONFIG[t].icon}</span> {t}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-400">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
              Topic changes in <strong className="text-amber-700">{nextChange}</strong>
            </div>
            <div className="relative">
              <input className="glass-input rounded-full text-xs px-3 py-1.5 pr-8 w-44" placeholder="Search topics..." />
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2" width="12" height="12" fill="none" stroke="rgba(130,100,25,0.45)" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: "linear-gradient(135deg,#d4a018,#8a6205)" }}>
              U
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="max-w-screen-xl mx-auto px-5 py-4 relative z-10">

        {/* Sub-tags row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`badge ${config.badge}`}>{config.icon} {topic}</span>
          {config.subtags.map((tag) => (
            <button key={tag} className={`glass-tag ${activeTag === tag ? "active" : ""}`} onClick={() => setActiveTag(activeTag === tag ? "" : tag)}>
              {tag}
            </button>
          ))}
        </div>

        <div className="flex gap-4">

          {/* ─── LEFT: AD + QUESTION + FORUM ─── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* QUESTION BANNER */}
            <div className="glass-question rounded-xl px-5 py-4 question-animate" key={question}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(255,255,255,0.6)" }}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.65rem] font-bold uppercase tracking-widest mb-1" style={{ color: config.color }}>
                    Hot Question · {topic}
                  </p>
                  <h2 className="text-base font-black text-stone-800 leading-snug">{question}</h2>
                  <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                    Refreshes in {nextChange} · Drop your answer below
                  </p>
                </div>
              </div>
            </div>

            {/* AD AREA */}
            <div className="glass-card rounded-xl overflow-hidden">
              {/* Ad header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-amber-100/50">
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Sponsored</span>
                <div className="flex items-center gap-2">
                  {adLabels.map((_, i) => (
                    <button
                      key={i}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ background: i === adIndex ? config.color : "rgba(180,150,60,0.25)" }}
                      onClick={() => setAdIndex(i)}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-400">{adIndex + 1} / {adLabels.length}</span>
              </div>

              {/* Auto-timer bar */}
              <div className="h-[3px] w-full" style={{ background: "rgba(200,170,60,0.12)" }}>
                <div className="ad-timer-bar" style={{ width: `${adTimer}%` }} />
              </div>

              {/* Ad slot */}
              <div className="glass-ad-area mx-4 my-4 relative" style={{ minHeight: 280 }}>
                <AdSlot slotLabel={adLabels[adIndex]} index={adIndex} />
              </div>

              {/* Prev / Next */}
              <div className="flex items-center justify-between px-4 pb-4 gap-4">
                <button
                  className="glass-btn rounded-full flex items-center gap-2 px-4 py-2 text-sm font-semibold"
                  onClick={prevAd}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M15 19l-7-7 7-7" /></svg>
                  Previous
                </button>
                <div className="flex-1 text-center">
                  <p className="text-xs font-semibold text-stone-600">{adLabels[adIndex]}</p>
                  <p className="text-[0.65rem] text-stone-400">Auto-advances in {Math.ceil(AD_DURATION - (adTimer / 100) * AD_DURATION)}s</p>
                </div>
                <button
                  className="glass-btn-gold rounded-full flex items-center gap-2 px-4 py-2 text-sm"
                  onClick={nextAd}
                >
                  Next
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* FORUM / COMMENTS */}
            <div className="glass-card rounded-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-amber-100/50">
                {(["Discussion", "Forum", "Top Picks"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setForumTab(tab)}
                    className={`px-4 py-3 text-sm transition-all ${forumTab === tab ? "forum-tab-active" : "forum-tab-inactive"}`}
                  >
                    {tab}
                  </button>
                ))}
                <div className="ml-auto flex items-center pr-4 gap-1.5">
                  <span className="text-xs text-stone-400">{comments.length} replies</span>
                </div>
              </div>

              <div className="p-4">
                {/* Comment input */}
                <div className="flex gap-3 mb-5">
                  <div className="c-avatar text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#d4a018,#8a6205)" }}>YO</div>
                  <div className="flex-1 relative">
                    <textarea
                      className="glass-input w-full rounded-xl px-4 py-3 text-sm pr-10 resize-none"
                      rows={2}
                      placeholder={`Share your take on: ${question}`}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postComment(); } }}
                    />
                    <button
                      onClick={postComment}
                      className="absolute right-3 bottom-3 text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Comment list */}
                <div className="flex flex-col gap-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="c-avatar text-white" style={{ background: c.grad }}>{c.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-stone-700">{c.user}</span>
                          <span className={`badge ${config.badge}`}>{topic}</span>
                          <span className="text-xs text-stone-400 ml-auto">{c.time}</span>
                        </div>
                        <p className="text-sm text-stone-600 leading-relaxed">{c.text}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            className={`vote-btn ${voted[c.id] ? "upvoted" : ""}`}
                            onClick={() => toggleVote(c.id)}
                          >
                            <svg width="11" height="11" fill={voted[c.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                              <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                            {c.votes + (voted[c.id] ? 1 : 0)}
                          </button>
                          <button className="text-xs text-amber-700 font-semibold hover:underline">Reply</button>
                          <button className="text-xs text-stone-400 hover:text-stone-600">Share</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ─── RIGHT: LIVE CHAT SIDEBAR ─── */}
          <div className="w-72 flex-shrink-0">
            <div className="glass-sidebar rounded-xl sticky top-20 flex flex-col overflow-hidden" style={{ height: "calc(100vh - 6rem)" }}>
              <LiveChat topic={topic} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
