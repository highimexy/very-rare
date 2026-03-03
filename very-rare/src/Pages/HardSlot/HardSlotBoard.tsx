import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Symbols ordered by rarity (least to most rare)
const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣", "🃏"];
const WILD = "🃏";

// Weighted random — rarer symbols appear less often
const WEIGHTS = [20, 18, 16, 14, 10, 8, 6, 8]; // 🃏 WILD is somewhat rare
const TOTAL_WEIGHT = WEIGHTS.reduce((a, b) => a + b, 0);

const weightedRand = () => {
  let r = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < SYMBOLS.length; i++) {
    r -= WEIGHTS[i];
    if (r <= 0) return SYMBOLS[i];
  }
  return SYMBOLS[0];
};

// Base payout for 5-of-a-kind on a single line
const SYMBOL_PAYOUTS: Record<string, number> = {
  "🍒": 3,
  "🍋": 5,
  "🍊": 8,
  "🍇": 10,
  "⭐": 20,
  "💎": 100,
  "7️⃣": 50,
  "🃏": 200,
};

// Paylines: array of row indices [top=0, mid=1, bot=2] for each of 5 reels
const PAYLINES = [
  [1, 1, 1, 1, 1], // Middle row (most common)
  [0, 0, 0, 0, 0], // Top row
  [2, 2, 2, 2, 2], // Bottom row
  [0, 1, 2, 1, 0], // V-shape (down)
  [2, 1, 0, 1, 2], // V-shape (up)
];

const PAYLINE_COLORS = [
  "rgba(250,204,21,0.7)",   // yellow - middle
  "rgba(96,165,250,0.7)",   // blue - top
  "rgba(52,211,153,0.7)",   // green - bottom
  "rgba(251,113,133,0.7)",  // pink - V down
  "rgba(167,139,250,0.7)",  // purple - V up
];

type ReelSymbols = [string, string, string]; // [top, mid, bot]

interface HardSlotBoardProps {
  betAmount: number;
  isGameActive: boolean;
  onGameEnd: (winAmount?: number) => void;
}

function checkPayline(
  reels: ReelSymbols[],
  payline: number[]
): { count: number; symbol: string } {
  const syms = payline.map((row, reelIdx) => reels[reelIdx][row]);
  // Find base symbol (first non-WILD)
  const baseSymbol = syms.find((s) => s !== WILD) ?? WILD;
  let count = 0;
  for (const s of syms) {
    if (s === baseSymbol || s === WILD) count++;
    else break; // must be consecutive from left
  }
  return { count, symbol: baseSymbol };
}

function calculateTotalWin(reels: ReelSymbols[], betPerLine: number): number {
  let total = 0;
  for (const payline of PAYLINES) {
    const { count, symbol } = checkPayline(reels, payline);
    if (count >= 3) {
      const base = SYMBOL_PAYOUTS[symbol] ?? 3;
      const factor = count === 5 ? 1.0 : count === 4 ? 0.25 : 0.08;
      total += betPerLine * base * factor;
    }
  }
  return parseFloat(total.toFixed(2));
}

function HardSlotBoard({ betAmount, isGameActive, onGameEnd }: HardSlotBoardProps) {
  const makeReel = (): ReelSymbols => [
    weightedRand(),
    weightedRand(),
    weightedRand(),
  ];

  const [reels, setReels] = useState<ReelSymbols[]>(
    Array.from({ length: 5 }, makeReel)
  );
  const [spinning, setSpinning] = useState<boolean[]>(
    Array(5).fill(false)
  );
  const [gameState, setGameState] = useState<"idle" | "spinning" | "result">(
    "idle"
  );
  const [winAmount, setWinAmount] = useState(0);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [activePaylineIdx, setActivePaylineIdx] = useState<number | null>(null);
  const intervals = useRef<number[]>([]);
  const paylineTimer = useRef<number | null>(null);

  const clearAllIntervals = () => {
    intervals.current.forEach(clearInterval);
    intervals.current = [];
    if (paylineTimer.current !== null) clearInterval(paylineTimer.current);
  };

  useEffect(() => {
    if (isGameActive && gameState === "idle") startSpin();
    if (!isGameActive) {
      clearAllIntervals();
      setGameState("idle");
      setWinAmount(0);
      setWinningLines([]);
      setActivePaylineIdx(null);
      setSpinning(Array(5).fill(false));
    }
    return () => clearAllIntervals();
  }, [isGameActive]);

  const startSpin = () => {
    const finalReels: ReelSymbols[] = Array.from({ length: 5 }, makeReel);
    setGameState("spinning");
    setSpinning(Array(5).fill(true));
    setWinAmount(0);
    setWinningLines([]);
    setActivePaylineIdx(null);

    const STOP_TIMES = [700, 1150, 1600, 2050, 2500];

    STOP_TIMES.forEach((stopTime, reelIdx) => {
      const interval = window.setInterval(() => {
        setReels((prev) => {
          const next = [...prev] as ReelSymbols[];
          next[reelIdx] = makeReel();
          return next;
        });
      }, 75);
      intervals.current.push(interval);

      window.setTimeout(() => {
        clearInterval(interval);
        setReels((prev) => {
          const next = [...prev] as ReelSymbols[];
          next[reelIdx] = finalReels[reelIdx];
          return next;
        });
        setSpinning((prev) => {
          const next = [...prev];
          next[reelIdx] = false;
          return next;
        });

        if (reelIdx === 4) {
          const betPerLine = betAmount / PAYLINES.length;
          const totalWin = calculateTotalWin(finalReels, betPerLine);
          const winLines: number[] = [];
          PAYLINES.forEach((pl, li) => {
            const { count } = checkPayline(finalReels, pl);
            if (count >= 3) winLines.push(li);
          });

          setWinAmount(totalWin);
          setWinningLines(winLines);
          setGameState("result");

          // Cycle through winning paylines for visual feedback
          if (winLines.length > 0) {
            let cycleIdx = 0;
            const timer = window.setInterval(() => {
              setActivePaylineIdx(winLines[cycleIdx % winLines.length]);
              cycleIdx++;
            }, 500);
            paylineTimer.current = timer;
          }

          window.setTimeout(() => {
            if (paylineTimer.current !== null) clearInterval(paylineTimer.current);
            setActivePaylineIdx(null);
            onGameEnd(totalWin);
            setGameState("idle");
          }, 3000);
        }
      }, stopTime);
    });
  };

  // Draw payline path highlight
  const getPaylineHighlight = (lineIdx: number) => {
    const payline = PAYLINES[lineIdx];
    const REEL_W = 64;
    const REEL_H = 64;
    const GAP = 8;
    const points = payline.map((row, col) => ({
      x: col * (REEL_W + GAP) + REEL_W / 2,
      y: row * REEL_H + REEL_H / 2,
    }));
    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    return { d, color: PAYLINE_COLORS[lineIdx] };
  };

  const totalW = 5 * 64 + 4 * 8; // 5 reels * width + 4 gaps
  const totalH = 3 * 64;          // 3 rows * height

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      {/* Idle */}
      <AnimatePresence>
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="font-pirata text-3xl text-orange-400"
          >
            Place Bet to Spin
          </motion.div>
        )}
      </AnimatePresence>

      {/* Machine */}
      <div className="relative bg-gradient-to-b from-[#1a0a2e] to-[#0d0620] rounded-2xl border-4 border-orange-500/60 shadow-[0_0_50px_rgba(234,88,12,0.3),inset_0_0_40px_rgba(234,88,12,0.04)] p-5 w-full">
        {/* PAYLINE indicators (left sidebar) */}
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {PAYLINES.map((_, i) => (
            <motion.div
              key={i}
              animate={
                winningLines.includes(i) && activePaylineIdx === i
                  ? { scale: 1.4, opacity: 1 }
                  : winningLines.includes(i)
                  ? { scale: 1.1, opacity: 0.8 }
                  : { scale: 1, opacity: 0.3 }
              }
              className="w-3 h-3 rounded-full border-2"
              style={{
                borderColor: PAYLINE_COLORS[i],
                backgroundColor:
                  winningLines.includes(i)
                    ? PAYLINE_COLORS[i]
                    : "transparent",
              }}
            />
          ))}
        </div>

        {/* Reels area with SVG overlay for paylines */}
        <div className="relative mx-auto" style={{ width: totalW, height: totalH }}>
          {/* SVG payline highlight */}
          <svg
            className="absolute inset-0 pointer-events-none z-20"
            width={totalW}
            height={totalH}
          >
            {activePaylineIdx !== null &&
              winningLines.includes(activePaylineIdx) && (() => {
                const { d, color } = getPaylineHighlight(activePaylineIdx);
                return (
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />
                );
              })()}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Reels */}
          <div className="flex gap-2">
            {reels.map((reel, reelIdx) => (
              <div
                key={reelIdx}
                className="relative overflow-hidden rounded-lg flex-shrink-0"
                style={{ width: 64 }}
              >
                {/* Fades */}
                <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#1a0a2e] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#1a0a2e] to-transparent z-10 pointer-events-none" />

                <div className="flex flex-col">
                  {reel.map((sym, rowIdx) => {
                    const isMid = rowIdx === 1;
                    return (
                      <motion.div
                        key={`${reelIdx}-${rowIdx}`}
                        className={`w-16 h-16 flex items-center justify-center text-3xl ${
                          isMid
                            ? spinning[reelIdx]
                              ? "bg-orange-500/5"
                              : "bg-orange-500/10"
                            : "opacity-35"
                        }`}
                        animate={
                          spinning[reelIdx]
                            ? { filter: "blur(5px)" }
                            : { filter: "blur(0px)" }
                        }
                        transition={{ duration: 0.1 }}
                      >
                        <motion.span
                          key={`${sym}-${reelIdx}-${rowIdx}-${spinning[reelIdx]}`}
                          initial={!spinning[reelIdx] ? { scale: 0.6 } : {}}
                          animate={!spinning[reelIdx] ? { scale: 1 } : {}}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 18,
                          }}
                        >
                          {sym}
                        </motion.span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spin indicators */}
        <div className="mt-3 flex justify-center gap-1.5">
          {spinning.map((s, i) => (
            <motion.div
              key={i}
              animate={s ? { scale: [1, 1.5, 1] } : { scale: 1 }}
              transition={{ repeat: s ? Infinity : 0, duration: 0.45 }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                s ? "bg-orange-400" : "bg-orange-400/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Paytable legend */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-xs text-gray-500 w-full px-2">
        {Object.entries(SYMBOL_PAYOUTS)
          .filter(([s]) => s !== WILD)
          .map(([sym, payout]) => (
            <div key={sym} className="flex items-center gap-1">
              <span>{sym}{sym}{sym}</span>
              <span className="text-orange-400 font-bold">
                {(payout * 0.08).toFixed(1)}x
              </span>
            </div>
          ))}
      </div>
      <div className="text-xs text-gray-600 flex gap-4">
        <span>🃏 WILD — substitutes any</span>
        <span>5 paylines active</span>
      </div>

      {/* Result */}
      <AnimatePresence>
        {gameState === "result" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center"
          >
            {winAmount > 0 ? (
              <div>
                <div className="font-pirata text-5xl text-orange-400 drop-shadow-[0_0_25px_rgba(234,88,12,1)]">
                  {winningLines.length} LINE WIN!
                </div>
                <div className="text-2xl font-mono text-white mt-2">
                  +{winAmount.toFixed(2)}
                </div>
              </div>
            ) : (
              <div className="font-pirata text-4xl text-gray-500">No Win</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HardSlotBoard;
