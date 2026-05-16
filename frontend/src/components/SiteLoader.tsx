import type { CSSProperties } from "react";
import logoMain from "../assets/color white.png";

type SiteLoaderProps = {
  isVisible: boolean;
};

const TILES = [
  { x: -230, y: -130, delay: 0.04, color: "#C4522A", size: 24 },
  { x: 230, y: -130, delay: 0.14, color: "#4E9BA8", size: 28 },
  { x: -260, y: 30, delay: 0.22, color: "#B8872A", size: 18 },
  { x: 260, y: 30, delay: 0.1, color: "#C4522A", size: 24 },
  { x: 0, y: -215, delay: 0.18, color: "#4E9BA8", size: 24 },
  { x: 0, y: 230, delay: 0.28, color: "#B8872A", size: 26 },
  { x: -140, y: 195, delay: 0.06, color: "#C4522A", size: 18 },
  { x: 140, y: 195, delay: 0.32, color: "#4E9BA8", size: 20 },
  { x: -300, y: -55, delay: 0.25, color: "#B8872A", size: 15 },
  { x: 300, y: -55, delay: 0.11, color: "#C4522A", size: 15 },
  { x: -110, y: -225, delay: 0.38, color: "#4E9BA8", size: 20 },
  { x: 110, y: -225, delay: 0.2, color: "#B8872A", size: 18 },
];

const PROGRESS = [
  "#C4522A",
  "#B8872A",
  "#4E9BA8",
  "#B8872A",
  "#C4522A",
  "#4E9BA8",
];

function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];

  return (
    <svg
      className={`am-corner am-corner--${pos}`}
      width="56"
      height="56"
      viewBox="0 0 60 60"
      fill="none"
      style={{ transform: flip }}
      aria-hidden="true"
    >
      <path d="M3 30 L3 3 L30 3" stroke="rgba(180,100,40,0.52)" strokeWidth="1.5" />
      <line x1="3" y1="16" x2="16" y2="16" stroke="rgba(196,82,42,0.4)" />
      <line x1="16" y1="3" x2="16" y2="16" stroke="rgba(196,82,42,0.4)" />
      <circle cx="3" cy="3" r="3" fill="rgba(184,135,42,0.75)" />
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');

@keyframes am-fade-out {
  to { opacity: 0; visibility: hidden; }
}

@keyframes am-card-in {
  from { opacity: 0; transform: translate3d(0, 24px, 0) scale(.96); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}

@keyframes am-float {
  0%,100% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(0,-8px,0); }
}

@keyframes am-logo-glow {
  0%,100% { filter: drop-shadow(0 10px 24px rgba(184,135,42,.18)); }
  50% { filter: drop-shadow(0 14px 34px rgba(184,135,42,.38)); }
}

@keyframes am-tile-in {
  from {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) rotate(45deg) scale(.2);
  }
  to {
    opacity: .72;
    transform: translate3d(-50%, -50%, 0) rotate(45deg) scale(1);
  }
}

@keyframes am-tile-float {
  0%,100% {
    transform: translate3d(-50%, -50%, 0) rotate(45deg);
  }
  50% {
    transform: translate3d(-50%, calc(-50% - 10px), 0) rotate(45deg);
  }
}

@keyframes am-text-in {
  from { opacity: 0; letter-spacing: .45em; transform: translateY(10px); }
  to { opacity: 1; letter-spacing: .28em; transform: translateY(0); }
}

@keyframes am-sub-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes am-progress {
  0%,100% { opacity: .35; transform: rotate(45deg) scale(.8); }
  50% { opacity: 1; transform: rotate(45deg) scale(1.15); }
}

.am-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  overflow: hidden;
  opacity: 1;
  visibility: visible;
  pointer-events: all;
  transform: translateZ(0);
}

.am-loader--hidden {
  animation: am-fade-out .55s ease forwards;
  pointer-events: none;
}

.am-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 12%, rgba(225,195,140,.55), transparent 38%),
    radial-gradient(circle at 82% 88%, rgba(210,175,115,.42), transparent 42%),
    linear-gradient(135deg, #f5ead5 0%, #ead8bc 52%, #d9c9a6 100%);
}

.am-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 48%, rgba(90,48,20,.18));
}

.am-tile {
  position: fixed;
  left: calc(50% + var(--tx));
  top: calc(50% + var(--ty));
  width: var(--ts);
  height: var(--ts);
  background: var(--tc);
  border-radius: 2px;
  opacity: 0;
  will-change: transform, opacity;
  animation:
    am-tile-in .62s cubic-bezier(.2,.9,.2,1) var(--td) forwards,
    am-tile-float 4.2s ease-in-out calc(var(--td) + .7s) infinite;
}

.am-center {
  position: relative;
  z-index: 2;
  animation: am-card-in .75s cubic-bezier(.16,1,.3,1) both;
}

.am-card {
  position: relative;
  min-width: 340px;
  padding: 48px 68px 46px;
  border-radius: 26px;
  background: rgba(250,244,230,.9);
  border: 1px solid rgba(180,130,60,.25);
  box-shadow:
    0 24px 80px rgba(64,36,14,.14),
    inset 0 0 0 1px rgba(255,255,255,.42);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.am-card::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 18px;
  border: 1px solid rgba(180,130,60,.12);
  pointer-events: none;
}

.am-corner {
  position: absolute;
  pointer-events: none;
}

.am-corner--tl { top: -2px; left: -2px; }
.am-corner--tr { top: -2px; right: -2px; }
.am-corner--bl { bottom: -2px; left: -2px; }
.am-corner--br { bottom: -2px; right: -2px; }

.am-logo-wrap {
  animation: am-float 4.5s ease-in-out infinite;
}

.am-logo {
  width: 185px;
  height: 185px;
  object-fit: contain;
  display: block;
  animation: am-logo-glow 3.8s ease-in-out infinite;
}

.am-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 230px;
}

.am-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(184,135,42,.58), transparent);
}

.am-divider-dot {
  width: 7px;
  height: 7px;
  background: rgba(196,82,42,.72);
  transform: rotate(45deg);
  border-radius: 1px;
}

.am-name {
  margin: 0;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: .28em;
  color: rgba(55,26,12,.88);
  text-transform: uppercase;
  white-space: nowrap;
  animation: am-text-in .85s ease .35s both;
}

.am-sub {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-style: italic;
  letter-spacing: .06em;
  color: #a45b30;
  white-space: nowrap;
  animation: am-sub-in .85s ease .48s both;
}

.am-progress {
  position: fixed;
  bottom: 38px;
  left: 50%;
  z-index: 3;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.am-ptile {
  width: 9px;
  height: 9px;
  background: var(--ptc);
  border-radius: 1px;
  transform: rotate(45deg);
  animation: am-progress 1.15s ease-in-out infinite;
  animation-delay: var(--ptd);
}

@media (max-width: 640px) {
  .am-card {
    min-width: 0;
    width: calc(100vw - 44px);
    padding: 38px 24px 36px;
    border-radius: 24px;
  }

  .am-logo {
    width: 150px;
    height: 150px;
  }

  .am-name {
    font-size: 11px;
    letter-spacing: .2em;
  }

  .am-sub {
    font-size: 16px;
  }

  .am-tile {
    opacity: .45;
  }

  .am-divider {
    width: 190px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .am-loader,
  .am-center,
  .am-logo-wrap,
  .am-logo,
  .am-tile,
  .am-ptile,
  .am-name,
  .am-sub {
    animation: none !important;
  }

  .am-loader--hidden {
    opacity: 0;
    visibility: hidden;
  }
}
`;

export default function SiteLoader({ isVisible }: SiteLoaderProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        className={`am-loader${isVisible ? "" : " am-loader--hidden"}`}
        aria-hidden={!isVisible}
      >
        <div className="am-bg" aria-hidden="true" />

        {TILES.map((tile, index) => (
          <div
            key={index}
            className="am-tile"
            aria-hidden="true"
            style={
              {
                "--tx": `${tile.x}px`,
                "--ty": `${tile.y}px`,
                "--ts": `${tile.size}px`,
                "--tc": tile.color,
                "--td": `${tile.delay}s`,
              } as CSSProperties
            }
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
          {PROGRESS.map((color, index) => (
            <div
              key={index}
              className="am-ptile"
              style={
                {
                  "--ptc": color,
                  "--ptd": `${index * 0.12}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}