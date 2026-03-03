import { useState } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { useBalance } from "../context/BalanceContext";

export interface SessionEntry {
  net: number; // win - bet: positive = profit, negative = loss
}

interface SidePanelProps {
  onBet: (amount: number) => void;
  isGameActive: boolean;
  theme?: "red" | "emerald" | "purple" | "yellow" | "orange" | "pink";
  sessionHistory?: SessionEntry[];
}

// SVG chart constants (viewBox coords)
const CW = 200;
const CH = 72;
const PX = 4;
const PY = 8;
const ZERO_Y = CH / 2; // 36

function SessionChart({ history }: { history: SessionEntry[] }) {
  if (history.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{ height: CH }}
      >
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">
          No rounds yet
        </span>
      </div>
    );
  }

  // Cumulative series: starts at 0, one point added per round
  const series: number[] = [0];
  for (const e of history) series.push(series[series.length - 1] + e.net);

  const n = series.length;
  const maxAbs = Math.max(...series.map(Math.abs), 0.01);

  const toX = (i: number) => PX + (i / (n - 1)) * (CW - 2 * PX);
  const toY = (v: number) => ZERO_Y - (v / maxAbs) * (ZERO_Y - PY);

  const points = series.map((v, i) => ({ x: toX(i), y: toY(v) }));
  const polyPts = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPts = [
    `${points[0].x},${ZERO_Y}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${points[n - 1].x},${ZERO_Y}`,
  ].join(" ");

  const totalNet = series[n - 1];
  const lineColor = totalNet >= 0 ? "#10b981" : "#ef4444";
  const areaFill =
    totalNet >= 0 ? "rgba(16,185,129,0.13)" : "rgba(239,68,68,0.13)";
  const lastPt = points[n - 1];

  return (
    <svg
      viewBox={`0 0 ${CW} ${CH}`}
      preserveAspectRatio="none"
      width="100%"
      height={CH}
      style={{ display: "block" }}
    >
      <defs>
        <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Zero line */}
      <line
        x1={PX}
        y1={ZERO_Y}
        x2={CW - PX}
        y2={ZERO_Y}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
        strokeDasharray="4 3"
      />

      {/* Area fill */}
      <polygon points={areaPts} fill={areaFill} />

      {/* Line */}
      <polyline
        points={polyPts}
        fill="none"
        stroke={lineColor}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Last point glowing dot */}
      <circle
        cx={lastPt.x}
        cy={lastPt.y}
        r={3}
        fill={lineColor}
        filter="url(#dotGlow)"
      />
    </svg>
  );
}

function SidePanel({
  onBet,
  isGameActive,
  theme = "red",
  sessionHistory = [],
}: SidePanelProps) {
  const { balance } = useBalance();
  const [betInput, setBetInput] = useState<string>("");

  const styles = {
    red: {
      icon: "text-red-500",
      text: "hover:text-red-500",
      btn: "bg-red-600 hover:bg-red-500 border-red-800 shadow-[0_0_20px_rgba(220,38,38,0.3)]",
    },
    emerald: {
      icon: "text-emerald-500",
      text: "hover:text-emerald-500",
      btn: "bg-emerald-600 hover:bg-emerald-500 border-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    },
    purple: {
      icon: "text-purple-500",
      text: "hover:text-purple-500",
      btn: "bg-purple-600 hover:bg-purple-500 border-purple-800 shadow-[0_0_20px_rgba(147,51,234,0.3)]",
    },
    yellow: {
      icon: "text-yellow-400",
      text: "hover:text-yellow-400",
      btn: "bg-yellow-500 hover:bg-yellow-400 border-yellow-700 shadow-[0_0_20px_rgba(250,204,21,0.3)]",
    },
    orange: {
      icon: "text-orange-500",
      text: "hover:text-orange-500",
      btn: "bg-orange-600 hover:bg-orange-500 border-orange-800 shadow-[0_0_20px_rgba(234,88,12,0.3)]",
    },
    pink: {
      icon: "text-pink-500",
      text: "hover:text-pink-500",
      btn: "bg-pink-600 hover:bg-pink-500 border-pink-800 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    },
  }[theme];

  const handleHalf = () => {
    if (!betInput) return;
    setBetInput((prev) => (Number(prev) / 2).toFixed(2));
  };

  const handleDouble = () => {
    if (!betInput) return;
    const doubled = Number(betInput) * 2;
    setBetInput(Math.min(doubled, balance).toFixed(2));
  };

  const handleMax = () => {
    setBetInput(balance.toFixed(2));
  };

  const handleBetClick = () => {
    const amount = parseFloat(betInput);
    if (isNaN(amount) || amount <= 0) {
      alert("Wpisz poprawną stawkę!");
      return;
    }
    if (amount > balance) {
      alert("Nie masz tyle kasy!");
      return;
    }
    onBet(amount);
  };

  // Session calculations
  const rounds = sessionHistory.length;
  const totalNet = sessionHistory.reduce((s, e) => s + e.net, 0);
  const wins = sessionHistory.filter((e) => e.net > 0).length;
  const winRate = rounds > 0 ? Math.round((wins / rounds) * 100) : 0;
  const netColor =
    totalNet > 0
      ? "text-emerald-400"
      : totalNet < 0
      ? "text-red-400"
      : "text-gray-400";
  const netSign = totalNet > 0 ? "+" : "";

  return (
    <div className="flex flex-col gap-1 text-white w-full">
      <h1 className="font-bold text-sm uppercase tracking-wider">Bet Amount</h1>
      <div className="bg-[#1e0b37] p-1 pr-3 rounded-sm flex flex-col gap-2 shadow-inner">
        <div className="flex items-center">
          <div className="relative grow">
            <input
              type="number"
              value={betInput}
              disabled={isGameActive}
              onChange={(e) => setBetInput(e.target.value)}
              className={`
                p-2 pl-4 pr-10 bg-[#10061f] outline-none rounded-sm w-full placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                ${isGameActive ? "opacity-50 cursor-not-allowed" : "text-white"}
              `}
              placeholder="0.00"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
              <HiOutlineCurrencyDollar className={`text-2xl ${styles.icon}`} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <button
              onClick={handleHalf}
              disabled={isGameActive}
              className={`px-3 cursor-pointer text-white ${styles.text} transition-colors disabled:opacity-30`}
            >
              1/2
            </button>
            <button
              onClick={handleDouble}
              disabled={isGameActive}
              className={`px-3 border-l-2 border-[#10061f] cursor-pointer ${styles.text} transition-colors disabled:opacity-30`}
            >
              x2
            </button>
            <button
              onClick={handleMax}
              disabled={isGameActive}
              className={`px-3 border-l-2 border-[#10061f] cursor-pointer ${styles.text} transition-colors disabled:opacity-30`}
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="w-full pt-4">
        <button
          onClick={handleBetClick}
          disabled={isGameActive}
          className={`
            w-full h-[60px] p-2 rounded-sm font-bold transition-all cursor-pointer uppercase tracking-widest
            ${
              isGameActive
                ? "bg-gray-800 text-gray-500 cursor-not-allowed border-none"
                : `${styles.btn} text-white active:scale-95 border-b-4`
            }
          `}
        >
          {isGameActive ? "Game in Progress" : "Place Bet"}
        </button>
      </div>

      {/* ── SESSION STATS ── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-bold text-sm uppercase tracking-wider">
            Session Stats
          </h1>
          {rounds > 0 && (
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              {rounds} round{rounds !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="bg-[#1e0b37] rounded-sm overflow-hidden">
          {/* Numbers row */}
          <div className="bg-[#10061f] px-3 py-2 flex justify-between items-center">
            <div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">
                Total P/L
              </div>
              <div className={`text-lg font-mono font-bold leading-none ${netColor}`}>
                {rounds === 0 ? "—" : `${netSign}${totalNet.toFixed(2)}`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-0.5">
                Win Rate
              </div>
              <div className="text-lg font-mono font-bold leading-none text-gray-300">
                {rounds === 0 ? "—" : `${winRate}%`}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#10061f] px-1 border-t border-[#1e0b37]">
            <SessionChart history={sessionHistory} />
          </div>

          {/* Mini round-bar history (last 20 rounds) */}
          {rounds > 0 && (
            <div className="bg-[#10061f] px-2 pb-2 pt-1 flex gap-[3px]">
              {sessionHistory.slice(-20).map((e, i) => (
                <div
                  key={i}
                  title={`${e.net >= 0 ? "+" : ""}${e.net.toFixed(2)}`}
                  className="h-1.5 rounded-full flex-1 min-w-[5px] max-w-3.5 cursor-default"
                  style={{
                    backgroundColor:
                      e.net > 0
                        ? "#10b981"
                        : e.net === 0
                        ? "#6b7280"
                        : "#ef4444",
                    opacity: 0.75,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
