// App.jsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.scss";

// tiny helper – clamp between min & max
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const intervalRef = useRef(null);

  // --------------------------
  // 1. Read / write state from URL
  // --------------------------
  const toDate = searchParams.get("toDate") || "";
  const title = searchParams.get("title") || "Countdown";
  const subtitle =
    searchParams.get("subtitle") || "Pick date and time to count down to";
  const bg = searchParams.get("bg") || "dark";
  const accent = searchParams.get("accent") || "blue";

  // --------------------------
  // 2. Countdown numbers
  // --------------------------
  const [days, setDays] = useState("--");
  const [hours, setHours] = useState("--");
  const [minutes, setMinutes] = useState("--");
  const [seconds, setSeconds] = useState("--");

  // --------------------------
  // 3. Tick logic
  // --------------------------
  useEffect(() => {
    if (!toDate) {
      setDays("--");
      setHours("--");
      setMinutes("--");
      setSeconds("--");
      return;
    }

    const target = new Date(toDate);
    if (isNaN(target)) return;

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        clearInterval(intervalRef.current);
        return;
      }
      setDays(Math.floor(diff / 86_400_000));
      setHours(Math.floor((diff % 86_400_000) / 3_600_000));
      setMinutes(Math.floor((diff % 3_600_000) / 60_000));
      setSeconds(Math.floor((diff % 60_000) / 1_000));
    };

    tick(); // first paint
    intervalRef.current = setInterval(tick, 1_000);
    return () => clearInterval(intervalRef.current);
  }, [toDate]);

  // --------------------------
  // 4. Handlers
  // --------------------------
  const inputRef = useRef(null);

  const start = () => {
    const val = inputRef.current?.value;
    if (!val) return;
    setSearchParams(
      (prev) => {
        prev.set("toDate", new Date(val).toISOString());
        return prev;
      },
      { replace: true }
    );
  };

  const updateParam = (key, value) =>
    setSearchParams(
      (prev) => {
        prev.set(key, value);
        return prev;
      },
      { replace: true }
    );

  // --------------------------
  // 5. Render
  // --------------------------
  return (
    <div className={`app theme-${bg} accent-${accent}`}>
      <div className="container">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>

        {/* Controls */}
        <div className="controls">
          <div className="row">
            <label>
              Target date
              <input
                type="datetime-local"
                ref={inputRef}
                defaultValue={toDate ? toDate.slice(0, 16) : ""}
              />
            </label>
            <button onClick={start}>Start / Update</button>
          </div>

          <div className="row">
            <label>
              Title
              <input
                value={title}
                onChange={(e) => updateParam("title", e.target.value)}
              />
            </label>
            <label>
              Subtitle
              <input
                value={subtitle}
                onChange={(e) => updateParam("subtitle", e.target.value)}
              />
            </label>
          </div>

          <div className="row">
            <label>
              Background
              <select
                value={bg}
                onChange={(e) => updateParam("bg", e.target.value)}
              >
                {["dark", "light", "neon", "sunset", "forest"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>

            <label>
              Accent
              <select
                value={accent}
                onChange={(e) => updateParam("accent", e.target.value)}
              >
                {["blue", "red", "green", "purple", "orange"].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Countdown display */}
        <div className="countdown-card">
          <div className="grid">
            <div className="item">
              <span className="value">{days}</span>
              <span className="label">Days</span>
            </div>
            <div className="item">
              <span className="value">{hours}</span>
              <span className="label">Hours</span>
            </div>
            <div className="item">
              <span className="value">{minutes}</span>
              <span className="label">Minutes</span>
            </div>
            <div className="item">
              <span className="value">{seconds}</span>
              <span className="label">Seconds</span>
            </div>
          </div>
        </div>

        {/* Share link */}
        <button
          className="share"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
          }}
        >
          Copy share link
        </button>
      </div>
    </div>
  );
}
