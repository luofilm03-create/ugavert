import { useEffect, useRef } from "react";

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

export default function AdUnit({ format = "auto", className = "", style, label }: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* ignore */ }
  }, []);

  return (
    <div ref={ref} className={`ad-wrapper ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: format === "rectangle" ? 250 : 90 }}
        data-ad-client="ca-pub-4036391133460180"
        data-ad-slot="auto"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* Visible fallback while awaiting AdSense approval */}
      <div className="ad-fallback">
        <span className="ad-fallback-label">{label ?? "Advertisement"}</span>
        <span className="ad-fallback-sub">Powered by Google AdSense</span>
      </div>
    </div>
  );
}

export function LeaderboardAd() {
  return <AdUnit format="auto" className="leaderboard-ad" label="Top Banner Advertisement" />;
}

export function DisplayAd({ label }: { label: string }) {
  return <AdUnit format="rectangle" className="display-ad" label={label} />;
}

export function InArticleAd() {
  return <AdUnit format="fluid" className="in-article-ad" label="In-Article Ad" />;
}
