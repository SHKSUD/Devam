import React, { useEffect, useRef, useState } from "react";

const svg = (t, a, b) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='100' height='100' fill='url(#g)'/><text x='50' y='50' dy='.35em' text-anchor='middle' font-family='system-ui,sans-serif' font-size='40' font-weight='600' fill='#fff'>${t}</text></svg>`
  );

export const PROFILES = [
  { id: "a", name: "Ava Morgan", src: svg("AM", "#4285F4", "#1A56C8") },
  { id: "b", name: "Ben Carter", src: svg("BC", "#EA4335", "#B3261E") },
  { id: "c", name: "Chloe Singh", src: svg("CS", "#34A853", "#0B6B2E") },
];

const CSS = `
.avs{position:relative;width:var(--avs-size);aspect-ratio:1;border-radius:50%;overflow:hidden;touch-action:pan-x;user-select:none;-webkit-user-select:none;cursor:grab;outline:none;flex:none;background:#e8eaed;box-shadow:0 0 0 2px #fff,0 1px 4px rgba(0,0,0,.35)}
.avs:active{cursor:grabbing}
.avs:focus-visible{box-shadow:0 0 0 2px #fff,0 0 0 4px #1a73e8}
.avs-layer{position:absolute;inset:0;will-change:transform}
.avs-layer img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;-webkit-user-drag:none}
@keyframes avs-out{from{transform:translateY(var(--from))}to{transform:translateY(calc(var(--dir)*100%))}}
@keyframes avs-in{from{transform:translateY(calc(var(--dir)*-100% + var(--from)))}to{transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){.avs-layer{animation-duration:1ms!important;transition:none!important}}
`;

export default function AvatarSwipeSwitcher({
  profiles = PROFILES,
  initialIndex = 0,
  size = "clamp(40px, 12vw, 72px)",
  onChange,
}) {
  const n = profiles.length;
  const wrap = (i) => (i + n) % n;
  const [index, setIndex] = useState(wrap(initialIndex));
  const [drag, setDrag] = useState(0);
  const [dir, setDir] = useState(0); // 1 = swipe down -> next (enters from top), -1 = swipe up -> previous (enters from bottom)
  const [active, setActive] = useState(false);
  const [settle, setSettle] = useState(null);
  const box = useRef(null);
  const g = useRef(null);
  const tc = useRef(0);
  const tr = useRef(0);

  useEffect(() => () => { clearTimeout(tc.current); clearTimeout(tr.current); }, []);

  const reset = () => {
    setDrag(0);
    tr.current = setTimeout(() => setDir(0), 200);
  };

  const commit = (d, from = 0) => {
    if (settle || n < 2) return reset();
    const next = wrap(index + d);
    const ms = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 360;
    clearTimeout(tr.current);
    setDir(d);
    setSettle({ d, from });
    tc.current = setTimeout(() => {
      setIndex(next);
      setSettle(null);
      setDir(0);
      setDrag(0);
      onChange?.(next, profiles[next]);
    }, ms);
  };

  const down = (e) => {
    if (settle || n < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    clearTimeout(tr.current);
    box.current.setPointerCapture?.(e.pointerId);
    g.current = { y: e.clientY, last: e.clientY, lt: e.timeStamp, v: 0, dy: 0 };
    setActive(true);
  };

  const move = (e) => {
    const s = g.current;
    if (!s) return;
    const h = box.current.offsetHeight;
    s.dy = e.clientY - s.y;
    s.v = (e.clientY - s.last) / Math.max(1, e.timeStamp - s.lt);
    s.last = e.clientY;
    s.lt = e.timeStamp;
    setDrag(Math.max(-h, Math.min(h, s.dy)));
    setDir(s.dy > 0 ? 1 : s.dy < 0 ? -1 : 0);
  };

  const end = (e) => {
    const s = g.current;
    if (!s) return;
    g.current = null;
    setActive(false);
    const h = box.current.offsetHeight || 1;
    const far = Math.abs(s.dy) > h * 0.35;
    const flick = Math.abs(s.v) > 0.5 && Math.abs(s.dy) > 6;
    if (e.type !== "pointercancel" && (far || flick)) {
      commit(far ? Math.sign(s.dy) : Math.sign(s.v), Math.max(-h, Math.min(h, s.dy)));
    } else reset();
  };

  const key = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); commit(1); }
    if (e.key === "ArrowUp") { e.preventDefault(); commit(-1); }
  };

  const cur = profiles[index];
  const d = settle ? settle.d : dir;
  const inc = profiles[wrap(index + d)];
  const from = settle ? settle.from : 0;
  const snap = active ? "none" : "transform .2s ease-out";
  const curStyle = settle
    ? { animation: "avs-out .2s ease-in forwards", "--dir": d, "--from": `${from}px` }
    : { transform: `translateY(${drag}px)`, transition: snap };
  const incStyle = settle
    ? { animation: "avs-in .34s cubic-bezier(.22,1,.36,1) forwards", "--dir": d, "--from": `${from}px` }
    : { transform: `translateY(calc(${-d * 100}% + ${drag}px))`, transition: snap };

  return (
    <>
      <style>{CSS}</style>
      <div
        ref={box}
        className="avs"
        style={{ "--avs-size": typeof size === "number" ? `${size}px` : size }}
        role="group"
        tabIndex={0}
        aria-label={`Account: ${cur.name}. Swipe or use arrow keys to switch.`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={key}
      >
        <div className="avs-layer" key={`c-${index}`} style={curStyle}>
          <img src={cur.src} alt="" draggable={false} />
        </div>
        {d !== 0 && n > 1 && (
          <div className="avs-layer" key={`i-${wrap(index + d)}-${d}`} style={incStyle}>
            <img src={inc.src} alt="" draggable={false} />
          </div>
        )}
      </div>
      <span aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {cur.name}
      </span>
    </>
  );
}

export function Demo() {
  const [i, setI] = useState(0);
  return (
    <div style={{ display: "grid", placeItems: "center", gap: 12, minHeight: "100svh", fontFamily: "system-ui,sans-serif" }}>
      <AvatarSwipeSwitcher onChange={setI} />
      <p>Active: {PROFILES[i].name} (index {i}). Swipe down: next. Swipe up: previous.</p>
    </div>
  );
}
