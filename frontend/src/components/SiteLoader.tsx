import logoMain from "../assets/color white.png";

type SiteLoaderProps = {
  isVisible: boolean;
};

// ─── Zellige tiles — spread wider and bigger ──────────────────────────────────
const TILES: Array<{ x: number; y: number; delay: number; color: string; size: number }> = [
  { x: -250, y: -145, delay: 0.04, color: "#C4522A", size: 26 },
  { x:  250, y: -145, delay: 0.14, color: "#4E9BA8", size: 32 },
  { x: -285, y:   26, delay: 0.24, color: "#B8872A", size: 20 },
  { x:  285, y:   26, delay: 0.09, color: "#C4522A", size: 28 },
  { x:    0, y: -235, delay: 0.19, color: "#4E9BA8", size: 26 },
  { x:    0, y:  255, delay: 0.29, color: "#B8872A", size: 32 },
  { x: -150, y:  215, delay: 0.06, color: "#C4522A", size: 20 },
  { x:  150, y:  215, delay: 0.34, color: "#4E9BA8", size: 24 },
  { x: -320, y:  -60, delay: 0.27, color: "#B8872A", size: 18 },
  { x:  320, y:  -60, delay: 0.11, color: "#C4522A", size: 16 },
  { x: -118, y: -245, delay: 0.41, color: "#4E9BA8", size: 26 },
  { x:  118, y: -245, delay: 0.21, color: "#B8872A", size: 20 },
  { x: -385, y:   95, delay: 0.31, color: "#4E9BA8", size: 14 },
  { x:  385, y:   95, delay: 0.17, color: "#C4522A", size: 18 },
  { x:  -82, y:  300, delay: 0.44, color: "#B8872A", size: 14 },
  { x:   82, y:  300, delay: 0.07, color: "#C4522A", size: 12 },
  { x: -226, y: -275, delay: 0.37, color: "#4E9BA8", size: 20 },
  { x:  226, y: -275, delay: 0.02, color: "#B8872A", size: 18 },
  { x: -430, y:  -14, delay: 0.48, color: "#C4522A", size: 12 },
  { x:  430, y:  -14, delay: 0.16, color: "#4E9BA8", size: 14 },
  { x:  -58, y: -315, delay: 0.52, color: "#B8872A", size: 12 },
  { x:   58, y: -315, delay: 0.33, color: "#C4522A", size: 14 },
  { x: -340, y:  185, delay: 0.22, color: "#B8872A", size: 16 },
  { x:  340, y:  185, delay: 0.40, color: "#C4522A", size: 14 },
];

// ─── Progress indicator tiles ─────────────────────────────────────────────────
const PROGRESS: Array<{ color: string; delay: string }> = [
  { color: "#C4522A", delay: "1.3s"  },
  { color: "#B8872A", delay: "1.45s" },
  { color: "#4E9BA8", delay: "1.6s"  },
  { color: "#B8872A", delay: "1.75s" },
  { color: "#C4522A", delay: "1.9s"  },
  { color: "#4E9BA8", delay: "2.05s" },
  { color: "#B8872A", delay: "2.2s"  },
  { color: "#C4522A", delay: "2.35s" },
  { color: "#4E9BA8", delay: "2.5s"  },
];

// ─── SVG corner ornament ──────────────────────────────────────────────────────
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = { tl: "scale(1,1)", tr: "scale(-1,1)", bl: "scale(1,-1)", br: "scale(-1,-1)" }[pos];
  return (
    <svg
      className={`am-corner am-corner--${pos}`}
      width="60" height="60" viewBox="0 0 60 60"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip }}
      aria-hidden="true"
    >
      <path d="M3 30 L3 3 L30 3" stroke="rgba(180,100,40,0.55)" strokeWidth="1.5" />
      <line x1="3" y1="16" x2="16" y2="16" stroke="rgba(196,82,42,0.45)" strokeWidth="1" />
      <line x1="16" y1="3" x2="16" y2="16" stroke="rgba(196,82,42,0.45)" strokeWidth="1" />
      <circle cx="3" cy="3" r="3" fill="rgba(184,135,42,0.80)" />
      <rect x="13" y="13" width="6" height="6" transform="rotate(45 16 16)"
        fill="rgba(184,135,42,0.20)" stroke="rgba(184,135,42,0.50)" strokeWidth="0.8" />
    </svg>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;1,300;1,400&display=swap');

/* ── Keyframes ─────────────────────────────────────── */
@keyframes am-tile-in {
  0%   { opacity: 0; transform: translate(-50%,-50%) rotate(45deg) scale(0); }
  65%  { opacity: 1;  transform: translate(-50%,-50%) rotate(45deg) scale(1.18); }
  100% { opacity: 0.72; transform: translate(-50%,-50%) rotate(45deg) scale(1); }
}
@keyframes am-tile-drift {
  0%,100% { top: calc(50% + var(--ty)); }
  50%     { top: calc(50% + var(--ty) - 12px); }
}
@keyframes am-logo-float {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-10px); }
}
@keyframes am-card-glow {
  0%,100% {
    box-shadow:
      0 12px 60px rgba(180,100,40,0.14),
      0 4px  12px rgba(180,100,40,0.08),
      0 40px 100px rgba(60,20,10,0.10),
      inset 0 0 0 1px rgba(184,135,42,0.13);
  }
  50% {
    box-shadow:
      0 12px 90px rgba(180,100,40,0.28),
      0 4px  22px rgba(180,100,40,0.16),
      0 40px 100px rgba(60,20,10,0.12),
      inset 0 0 0 1px rgba(184,135,42,0.24);
  }
}
@keyframes am-card-in {
  0%   { opacity: 0; transform: scale(0.93) translateY(28px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes am-text-in {
  0%   { opacity: 0; letter-spacing: 0.5em; transform: translateY(12px); }
  100% { opacity: 1; letter-spacing: 0.28em; transform: translateY(0); }
}
@keyframes am-sub-in {
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes am-shimmer {
  0%   { background-position: -250% center; }
  100% { background-position:  250% center; }
}
@keyframes am-draw-corner {
  0%   { stroke-dashoffset: 400; opacity: 0; }
  12%  { opacity: 1; }
  100% { stroke-dashoffset: 0; }
}

@keyframes am-bg-breath { 0%,100% { opacity: 0.92; } 50% { opacity: 1; } }
@keyframes am-progress-in {
  0%   { opacity: 0; transform: rotate(45deg) scale(0); }
  65%  { opacity: 1; transform: rotate(45deg) scale(1.3); }
  100% { opacity: 0.85; transform: rotate(45deg) scale(1); }
}
@keyframes am-loader-out {
  0%   { opacity: 1; }
  100% { opacity: 0; pointer-events: none; }
}
@keyframes am-logo-pulse {
  0%,100% { filter: drop-shadow(0 3px 14px rgba(184,135,42,0.22)) drop-shadow(0 5px 22px rgba(60,20,10,0.12)); }
  50%     { filter: drop-shadow(0 3px 28px rgba(184,135,42,0.50)) drop-shadow(0 5px 22px rgba(60,20,10,0.15)); }
}
@keyframes am-divider-in {
  0%   { opacity: 0; transform: scaleX(0); }
  100% { opacity: 1; transform: scaleX(1); }
}

/* ── Loader shell ─────────────────────────────────── */
.am-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.am-loader--hidden {
  animation: am-loader-out 0.95s cubic-bezier(0.4,0,0.2,1) forwards;
  pointer-events: none;
}

/* ── Background ───────────────────────────────────── */
.am-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 75% 65% at 18% 10%, rgba(225,195,140,0.60) 0%, transparent 52%),
    radial-gradient(ellipse 60% 55% at 82% 88%, rgba(210,175,115,0.45) 0%, transparent 52%),
    radial-gradient(ellipse 120% 120% at 50% 50%, #F2E8D4 0%, #EAD9BE 45%, #DDD0B0 100%);
  animation: am-bg-breath 5.5s ease-in-out infinite;
}
.am-noise {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
.am-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 90% 90% at 50% 50%, transparent 45%, rgba(110,62,22,0.20) 100%);
  pointer-events: none;
}



/* ── Zellige floating tiles ─────────────────────── */
.am-tile {
  position: fixed;
  left: calc(50% + var(--tx));
  top:  calc(50% + var(--ty));
  width:  var(--ts);
  height: var(--ts);
  background: var(--tc);
  border-radius: 2px;
  opacity: 0;
  transform: translate(-50%,-50%) rotate(45deg) scale(0);
  animation:
    am-tile-in    0.72s cubic-bezier(0.34,1.56,0.64,1) var(--td) forwards,
    am-tile-drift 3.4s  ease-in-out calc(var(--td) + 0.8s) infinite;
  will-change: transform, opacity, top;
}

/* ── Center card — significantly larger ───────────── */
.am-center {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: am-card-in 0.95s cubic-bezier(0.16,1,0.3,1) 0.1s both;
}
.am-card {
  position: relative;
  padding: 56px 80px 52px;
  border-radius: 24px;
  background: rgba(250,244,230,0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(180,130,60,0.28);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  animation: am-card-glow 3.8s ease-in-out 1.4s infinite;
  min-width: 360px;
}
.am-card::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 17px;
  border: 1px solid rgba(180,130,60,0.10);
  pointer-events: none;
}

/* Corner ornaments */
.am-corner { position: absolute; pointer-events: none; }
.am-corner--tl { top: -2px; left: -2px; }
.am-corner--tr { top: -2px; right: -2px; }
.am-corner--bl { bottom: -2px; left: -2px; }
.am-corner--br { bottom: -2px; right: -2px; }
.am-corner path, .am-corner line {
  stroke-dasharray: 400;
  animation: am-draw-corner 1.5s cubic-bezier(0.4,0,0.2,1) 0.5s both;
}

/* Logo — bigger */
.am-logo-wrap { animation: am-logo-float 4.8s ease-in-out 1.1s infinite; }
.am-logo {
  width: 200px;
  height: 200px;
  object-fit: contain;
  display: block;
  animation: am-logo-pulse 3.8s ease-in-out 1.4s infinite;
}

/* Divider */
.am-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 240px;
  animation: am-divider-in 0.8s ease 1s both;
}
.am-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,135,42,0.55), transparent);
}
.am-divider-dot {
  width: 7px; height: 7px;
  background: rgba(196,82,42,0.70);
  transform: rotate(45deg);
  border-radius: 1px;
  flex-shrink: 0;
}

/* Brand name — bigger, more presence */
.am-name {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.28em;
  color: rgba(55,26,12,0.88);
  text-transform: uppercase;
  margin: 0;
  white-space: nowrap;
  animation: am-text-in 1.1s cubic-bezier(0.16,1,0.3,1) 0.95s both;
}

/* Italic subtitle */
.am-sub {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.06em;
  margin: 0;
  white-space: nowrap;
  background: linear-gradient(
    90deg,
    rgba(196,82,42,0.90) 0%,
    rgba(184,135,42,1.00) 30%,
    rgba(196,82,42,0.95) 50%,
    rgba(184,135,42,1.00) 70%,
    rgba(78,155,168,0.85) 100%
  );
  background-size: 250% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation:
    am-sub-in  1.1s cubic-bezier(0.16,1,0.3,1) 1.1s both,
    am-shimmer 5s  linear 2.5s infinite;
}

/* ── Progress diamond row — bigger ────────────────── */
.am-progress {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}
.am-ptile {
  width: 10px; height: 10px;
  background: var(--ptc);
  opacity: 0;
  transform: rotate(45deg) scale(0);
  animation: am-progress-in 0.5s cubic-bezier(0.34,1.56,0.64,1) var(--ptd) forwards;
  border-radius: 1px;
}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function SiteLoader({ isVisible }: SiteLoaderProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        className={`am-loader${isVisible ? "" : " am-loader--hidden"}`}
        aria-hidden={!isVisible}
      >
        <div className="am-bg" aria-hidden="true" />
        <div className="am-noise" aria-hidden="true" />
        <div className="am-vignette" aria-hidden="true" />



        {TILES.map((t, i) => (
          <div
            key={i}
            className="am-tile"
            aria-hidden="true"
            style={{
              "--tx": `${t.x}px`,
              "--ty": `${t.y}px`,
              "--ts": `${t.size}px`,
              "--tc": t.color,
              "--td": `${t.delay}s`,
            } as React.CSSProperties}
          />
        ))}

        <div className="am-center">
          <div className="am-card">
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />

            <div className="am-logo-wrap">
              <img className="am-logo" src={logoMain} alt="L'Artisan de la Médina" />
            </div>

            <div className="am-divider">
              <div className="am-divider-line" />
              <div className="am-divider-dot" />
              <div className="am-divider-line" />
            </div>

            <p className="am-name">L'Artisan de la Médina</p>
            <p className="am-sub">Artisanat Tunisien Authentique</p>
          </div>
        </div>

        <div className="am-progress" aria-hidden="true">
          {PROGRESS.map((t, i) => (
            <div
              key={i}
              className="am-ptile"
              style={{ "--ptc": t.color, "--ptd": t.delay } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </>
  );
}
