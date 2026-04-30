import { useEffect, useRef, useState } from "react";

interface AdUnitProps {
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit({ format = "auto", className = "", style }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* ignore */ }

    // Watch for AdSense to fill the slot. Until then, we keep the ins
    // mounted (so AdSense can find it) but visually collapsed.
    const interval = window.setInterval(() => {
      const el = insRef.current;
      if (!el) return;
      const status = el.getAttribute("data-ad-status");
      if (status === "filled") {
        setFilled(true);
        window.clearInterval(interval);
      }
    }, 300);
    // Stop watching after 8s — if no fill by then, leave the ad collapsed.
    const timeout = window.setTimeout(() => window.clearInterval(interval), 8000);
    return () => { window.clearInterval(interval); window.clearTimeout(timeout); };
  }, []);

  // When unfilled, render a zero-height wrapper so the layout stays compact
  // but the <ins> is still in the DOM for AdSense to fill asynchronously.
  const wrapperStyle: React.CSSProperties = filled
    ? { ...style }
    : { ...style, height: 0, overflow: "hidden", margin: 0, padding: 0 };

  return (
    <div className={`ad-wrapper ${className}`} style={wrapperStyle}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-4036391133460180"
        data-ad-slot="auto"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function LeaderboardAd() {
  return <AdUnit format="auto" className="leaderboard-ad" />;
}

export function DisplayAd({ label }: { label: string }) {
  return <AdUnit format="rectangle" className="display-ad" label={label} />;
}

export function InArticleAd() {
  return <AdUnit format="fluid" className="in-article-ad" />;
}
