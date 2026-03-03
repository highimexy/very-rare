import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣"];

const WIN_MULTIPLIERS: Record<string, number> = {
  "💎": 50,
  "7️⃣": 20,
  "⭐": 10,
  "🍇": 5,
  "🍊": 4,
  "🍋": 3,
  "🍒": 2,
};

const rand = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

interface SimpleSlotBoardProps {
  betAmount: number;
  isGameActive: boolean;
  onGameEnd: (winAmount?: number) => void;
}

interface ReelSymbols {
  top: string;
  mid: string;
  bot: string;
}

function SimpleSlotBoard({ betAmount, isGameActive, onGameEnd }: SimpleSlotBoardProps) {
  const [reels, setReels] = useState<ReelSymbols[]>([
    { top: "⭐", mid: "🍒", bot: "💎" },
    { top: "🍋", mid: "🍊", bot: "7️⃣" },
    { top: "💎", mid: "🍇", bot: "🍒" },
  ]);
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false]);
  const [gameState, setGameState] = useState<"idle" | "spinning" | "result">("idle");
  const [result, setResult] = useState<{ mids: string[]; multiplier: number } | null>(null);
  const intervals = useRef<number[]>([]);

  const clearAllIntervals = () => {
    intervals.current.forEach(clearInterval);
    intervals.current = [];
  };

  useEffect(() => {
    if (isGameActive && gameState === "idle") {
      startSpin();
    }
    if (!isGameActive) {
      clearAllIntervals();
      setGameState("idle");
      setResult(null);
      setSpinning([false, false, false]);
    }
    return () => clearAllIntervals();
  }, [isGameActive]);

  const startSpin = () => {
    const finalMids = [rand(), rand(), rand()];
    setGameState("spinning");
    setSpinning([true, true, true]);
    setResult(null);

    const STOP_TIMES = [900, 1500, 2100];

    STOP_TIMES.forEach((stopTime, reelIdx) => {
      const interval = window.setInterval(() => {
        setReels((prev) => {
          const next = [...prev] as ReelSymbols[];
          next[reelIdx] = { top: rand(), mid: rand(), bot: rand() };
          return next;
        });
      }, 75);
      intervals.current.push(interval);

      window.setTimeout(() => {
        clearInterval(interval);
        const targetMid = finalMids[reelIdx];
        setReels((prev) => {
          const next = [...prev] as ReelSymbols[];
          next[reelIdx] = { top: rand(), mid: targetMid, bot: rand() };
          return next;
        });
        setSpinning((prev) => {
          const next = [...prev];
          next[reelIdx] = false;
          return next;
        });

        if (reelIdx === 2) {
          const allSame =
            finalMids[0] === finalMids[1] && finalMids[1] === finalMids[2];
          const multiplier = allSame ? (WIN_MULTIPLIERS[finalMids[0]] ?? 1) : 0;
          setResult({ mids: finalMids, multiplier });
          setGameState("result");

          window.setTimeout(() => {
            onGameEnd(betAmount * multiplier);
            setGameState("idle");
          }, 2500);
        }
      }, stopTime);
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      {/* Idle message */}
      <AnimatePresence>
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="font-pirata text-3xl text-yellow-400"
          >
            Place Bet to Spin
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slot machine cabinet */}
      <div className="relative bg-gradient-to-b from-[#1a0a2e] to-[#0d0620] rounded-2xl border-4 border-yellow-500/60 shadow-[0_0_50px_rgba(250,204,21,0.25),inset_0_0_40px_rgba(250,204,21,0.04)] p-5 w-full">
        {/* Top decorative label strip */}
        <div className="flex justify-center gap-2 mb-3">
          {["💎", "⭐", "7️⃣", "⭐", "💎"].map((s, i) => (
            <span key={i} className="text-yellow-400/30 text-xs">{s}</span>
          ))}
        </div>

        {/* Win line indicator */}
        <div className="absolute left-5 right-5 top-[calc(50%+12px)] -translate-y-1/2 flex items-center pointer-events-none z-20">
          <div className="h-0.5 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
          <div className="flex-1 h-px bg-red-500/25" />
          <div className="h-0.5 w-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
        </div>

        {/* Reel separator lines */}
        <div className="absolute left-[calc(33.33%+10px)] top-5 bottom-5 w-px bg-yellow-500/15 pointer-events-none" />
        <div className="absolute left-[calc(66.66%+10px)] top-5 bottom-5 w-px bg-yellow-500/15 pointer-events-none" />

        {/* Reels */}
        <div className="flex gap-2 justify-center">
          {reels.map((reel, reelIdx) => (
            <div key={reelIdx} className="relative overflow-hidden rounded-lg" style={{ width: 88 }}>
              {/* Top fade */}
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#1a0a2e] to-transparent z-10 pointer-events-none" />
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#1a0a2e] to-transparent z-10 pointer-events-none" />

              <div className="flex flex-col">
                {([reel.top, reel.mid, reel.bot] as const).map((sym, symIdx) => {
                  const isMid = symIdx === 1;
                  return (
                    <motion.div
                      key={`${reelIdx}-${symIdx}`}
                      className={`w-[88px] h-[88px] flex items-center justify-center select-none ${
                        isMid ? "bg-yellow-500/10" : "opacity-35"
                      }`}
                      animate={
                        spinning[reelIdx]
                          ? { filter: "blur(4px)" }
                          : { filter: "blur(0px)" }
                      }
                      transition={{ duration: 0.1 }}
                    >
                      <motion.span
                        className="text-5xl"
                        key={`${sym}-${reelIdx}-${symIdx}-${spinning[reelIdx]}`}
                        initial={
                          !spinning[reelIdx] && isMid
                            ? { scale: 0.6, opacity: 0 }
                            : {}
                        }
                        animate={
                          !spinning[reelIdx] && isMid
                            ? { scale: 1, opacity: 1 }
                            : {}
                        }
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

        {/* Spinning dots */}
        <div className="mt-3 flex justify-center gap-2">
          {spinning.map((s, i) => (
            <motion.div
              key={i}
              animate={s ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ repeat: s ? Infinity : 0, duration: 0.5 }}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                s ? "bg-yellow-400" : "bg-yellow-400/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Paytable */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-1 text-xs text-gray-500 w-full px-2">
        {Object.entries(WIN_MULTIPLIERS).map(([sym, mult]) => (
          <div key={sym} className="flex items-center gap-1">
            <span>{sym}{sym}{sym}</span>
            <span className="text-yellow-400 font-bold">{mult}x</span>
          </div>
        ))}
      </div>

      {/* Result message */}
      <AnimatePresence>
        {gameState === "result" && result && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center"
          >
            {result.multiplier > 0 ? (
              <div>
                <div className="font-pirata text-5xl text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,1)]">
                  WIN! {result.multiplier}x
                </div>
                <div className="text-xl font-mono text-white mt-1">
                  +{(betAmount * result.multiplier).toFixed(2)}
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

export default SimpleSlotBoard;
