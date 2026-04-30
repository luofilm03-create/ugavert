export const TOPICS = ["AI", "Crypto", "Investment", "Banking"] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_META: Record<Topic, {
  path: string;
  color: string;
  badgeClass: string;
  subtags: string[];
  questions: string[];
  adLabels: string[];
}> = {
  AI: {
    path: "/ai",
    color: "#7c3aed",
    badgeClass: "badge-ai",
    subtags: ["#VibeCode", "#LLMs", "#ChatGPT", "#Gemini", "#Cursor", "#Claude", "#Design", "#Replit"],
    questions: [
      "WHICH AI PLATFORM IS BEST FOR VIBE CODING?",
      "BEST AI FOR WEBSITE & APP DESIGNING?",
      "WHICH AI IMAGE GENERATOR IS MOST POWERFUL IN 2025?",
      "CHATGPT VS CLAUDE VS GEMINI — WHO WINS?",
      "CAN AI FULLY REPLACE DEVELOPERS BY 2026?",
      "BEST AI CODING ASSISTANT RIGHT NOW?",
      "WHICH AI WRITES THE CLEANEST, MOST RELIABLE CODE?",
    ],
    adLabels: ["AI Tools & Platforms", "Code with AI", "AI Productivity Suite", "Smart AI Assistant"],
  },
  Crypto: {
    path: "/crypto",
    color: "#d97706",
    badgeClass: "badge-crypto",
    subtags: ["#Bitcoin", "#Ethereum", "#DeFi", "#NFTs", "#Altcoins", "#Staking", "#Web3", "#Solana"],
    questions: [
      "WHICH CRYPTOCURRENCY WILL DOMINATE IN 2025?",
      "IS BITCOIN STILL THE KING OF CRYPTO?",
      "DEFI OR CEFI — WHICH IS SAFER FOR YOUR MONEY?",
      "BEST CRYPTO EXCHANGE PLATFORM RIGHT NOW?",
      "SHOULD YOU STAKE YOUR CRYPTO HOLDINGS IN 2025?",
      "ETHEREUM VS SOLANA — WHICH HAS MORE FUTURE?",
      "HOW DO YOU SPOT THE NEXT 100X ALTCOIN?",
    ],
    adLabels: ["Top Crypto Exchange", "Secure Your Bitcoin", "DeFi Yield Platform", "Crypto Portfolio Tracker"],
  },
  Investment: {
    path: "/investment",
    color: "#16a34a",
    badgeClass: "badge-invest",
    subtags: ["#Stocks", "#ETFs", "#RealEstate", "#Dividends", "#Passive", "#Portfolio", "#Options", "#Bonds"],
    questions: [
      "STOCKS VS CRYPTO — WHERE TO PUT YOUR MONEY IN 2025?",
      "BEST INVESTMENT STRATEGY FOR BEGINNERS THIS YEAR?",
      "IS REAL ESTATE STILL WORTH INVESTING IN?",
      "INDEX FUNDS VS INDIVIDUAL STOCKS — WHICH WINS LONG TERM?",
      "HOW TO BUILD PASSIVE INCOME STREAMS THAT LAST?",
      "WHAT IS THE SAFEST HIGH-YIELD INVESTMENT RIGHT NOW?",
      "DIVIDEND STOCKS OR GROWTH STOCKS — WHAT'S YOUR PICK?",
    ],
    adLabels: ["Smart Investment App", "Stock Market Signals", "Real Estate Platform", "Portfolio Manager Pro"],
  },
  Banking: {
    path: "/banking",
    color: "#1d4ed8",
    badgeClass: "badge-bank",
    subtags: ["#NeoBank", "#Savings", "#Loans", "#FinTech", "#BNPL", "#CreditCard", "#HYSA", "#Swift"],
    questions: [
      "BEST DIGITAL BANK IN 2025 — WHAT'S YOUR VOTE?",
      "TRADITIONAL BANK VS NEOBANK — WHICH IS BETTER?",
      "HOW TO MAXIMIZE YOUR SAVINGS INTEREST RATE?",
      "BEST CREDIT CARD FOR CASHBACK REWARDS IN 2025?",
      "IS YOUR MONEY ACTUALLY SAFE IN A DIGITAL BANK?",
      "WHICH FINTECH IS DISRUPTING BANKING THE MOST?",
      "BNPL VS CREDIT CARD — WHICH SHOULD YOU USE?",
    ],
    adLabels: ["Open a Digital Account", "Zero-Fee Banking", "High-Yield Savings", "Best Credit Card Offer"],
  },
};

export function pathToTopic(path: string): Topic {
  for (const t of TOPICS) {
    if (TOPIC_META[t].path === path) return t;
  }
  return "AI";
}
