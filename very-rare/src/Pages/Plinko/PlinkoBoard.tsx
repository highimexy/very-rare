import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const ROWS = 8;
const SLOTS = ROWS + 1; // 9 slots

// Multipliers: edges are low, center is jackpot
const MULTIPLIERS = [0.2, 0.5, 1.0, 2.0, 10.0, 2.0, 1.0, 0.5, 0.2];

const SLOT_COLORS = [
  "#ef4444", // 0.2x red
  "#f97316", // 0.5x orange
  "#eab308", // 1.0x yellow
  "#22c55e", // 2.0x green
  "#10b981", // 10x emerald
  "#22c55e", // 2.0x green
  "#eab308", // 1.0x yellow
  "#f97316", // 0.5x orange
  "#ef4444", // 0.2x red
];

const BOARD_W = 360;
const BOARD_H = 400;
const SLOT_W = BOARD_W / SLOTS;
const ROW_H = (BOARD_H - 60) / (ROWS + 1);
const PEG_R = 5;
const BALL_R = 9;

// Peg center: row r (0-indexed), peg p (0-indexed, 0..r)
// At row r there are (r+1) pegs, spread symmetrically
const pegX = (r: number, p: number) =>
  BOARD_W / 2 + (p - r / 2) * SLOT_W;
const pegY = (r: number) => (r + 1) * ROW_H;

// Compute ball path: returns array of {x, y} waypoints
const computePath = (): { waypoints: { x: number; y: number }[]; slot: number } => {
  const waypoints: { x: number; y: number }[] = [];
  // Start above center
  waypoints.push({ x: BOARD_W / 2, y: -BALL_R });

  let pegIdx = 0; // which peg in current row (0..r)
  for (let r = 0; r < ROWS; r++) {
    waypoints.push({ x: pegX(r, pegIdx), y: pegY(r) });
    if (Math.random() < 0.5) pegIdx += 1; // go right
    // go left: pegIdx stays (left sub-peg of next row = same index)
  }

  const finalSlot = pegIdx; // 0..ROWS
  const slotCenterX = (finalSlot + 0.5) * SLOT_W;
  waypoints.push({ x: slotCenterX, y: BOARD_H - 30 });

  return { waypoints, slot: finalSlot };
};

interface PlinkoBoardProps {
  betAmount: number;
  isGameActive: boolean;
  onGameEnd: (winAmount?: number) => void;
}

function PlinkoBoard({ betAmount, isGameActive, onGameEnd }: PlinkoBoardProps) {
  const [gameState, setGameState] = useState<"idle" | "dropping" | "result">("idle");
  const [lastSlot, setLastSlot] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [ballPos, setBallPos] = useState({ x: BOARD_W / 2, y: -BALL_R });
  const [showBall, setShowBall] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isGameActive && gameState === "idle") {
      dropBall();
    }
    if (!isGameActive) {
      controls.stop();
      setGameState("idle");
      setLastSlot(null);
      setWinAmount(0);
      setShowBall(false);
    }
  }, [isGameActive]);

  const dropBall = async () => {
    const { waypoints, slot } = computePath();
    setGameState("dropping");
    setLastSlot(null);
    setBallPos(waypoints[0]);
    setShowBall(true);

    // Animate through each waypoint sequentially
    // Gravity feel: first step fast (falling), each peg bounce slightly slows then re-accelerates
    for (let i = 1; i < waypoints.length; i++) {
      const wp = waypoints[i];
      const isLast = i === waypoints.length - 1;
      const duration = isLast ? 0.3 : i === 1 ? 0.35 : 0.22;
      const ease = isLast ? "easeOut" : "easeIn";

      await controls.start(
        { x: wp.x, y: wp.y },
        { duration, ease }
      );
    }

    // Settle in slot
    const multiplier = MULTIPLIERS[slot];
    const win = parseFloat((betAmount * multiplier).toFixed(2));
    setLastSlot(slot);
    setWinAmount(win);
    setGameState("result");
    setShowBall(false);

    setTimeout(() => {
      onGameEnd(win);
      setGameState("idle");
    }, 2500);
  };

  // Build all pegs
  const pegs: { x: number; y: number; key: string }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let p = 0; p <= r; p++) {
      pegs.push({ x: pegX(r, p), y: pegY(r), key: `${r}-${p}` });
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Idle */}
      <AnimatePresence>
        {gameState === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="font-pirata text-3xl text-pink-400"
          >
            Place Bet to Drop
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board SVG */}
      <div
        className="relative rounded-2xl border-4 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.25),inset_0_0_40px_rgba(236,72,153,0.04)] overflow-hidden"
        style={{ width: BOARD_W, background: "linear-gradient(to bottom, #1a0a2e, #0d0620)" }}
      >
        <svg
          width={BOARD_W}
          height={BOARD_H}
          className="block"
        >
          {/* Pegs */}
          {pegs.map((peg) => (
            <circle
              key={peg.key}
              cx={peg.x}
              cy={peg.y}
              r={PEG_R}
              fill="#ec4899"
              opacity={0.7}
              filter="url(#pegGlow)"
            />
          ))}

          {/* Slot buckets */}
          {MULTIPLIERS.map((mult, i) => {
            const x = i * SLOT_W;
            const y = BOARD_H - 55;
            const h = 55;
            const isWin = lastSlot === i;
            return (
              <g key={i}>
                <rect
                  x={x + 1}
                  y={y}
                  width={SLOT_W - 2}
                  height={h}
                  rx={4}
                  fill={SLOT_COLORS[i]}
                  opacity={isWin ? 0.95 : 0.25}
                  style={{ transition: "opacity 0.3s" }}
                />
                <text
                  x={x + SLOT_W / 2}
                  y={y + h / 2 + 5}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill={isWin ? "#fff" : SLOT_COLORS[i]}
                  opacity={isWin ? 1 : 0.8}
                  style={{ transition: "opacity 0.3s" }}
                >
                  {mult}x
                </text>
              </g>
            );
          })}

          {/* Glow filter for pegs */}
          <defs>
            <filter id="pegGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ballGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Animated ball (DOM div, not SVG, for framer-motion) */}
        {showBall && (
          <motion.div
            animate={controls}
            initial={{ x: ballPos.x - BALL_R, y: ballPos.y - BALL_R }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: BALL_R * 2,
              height: BALL_R * 2,
              background: "radial-gradient(circle at 35% 35%, #fff, #f9a8d4)",
              boxShadow: "0 0 12px rgba(236,72,153,0.9), 0 0 24px rgba(236,72,153,0.5)",
              top: 0,
              left: 0,
              translateX: -BALL_R,
              translateY: -BALL_R,
            }}
          />
        )}
      </div>

      {/* Payout reference */}
      <div className="flex gap-2 flex-wrap justify-center">
        {MULTIPLIERS.map((m, i) => (
          <div
            key={i}
            className="text-xs px-2 py-0.5 rounded-full font-bold border"
            style={{
              color: SLOT_COLORS[i],
              borderColor: SLOT_COLORS[i] + "60",
              backgroundColor: SLOT_COLORS[i] + "15",
            }}
          >
            {m}x
          </div>
        ))}
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
            {winAmount >= betAmount ? (
              <div>
                <div
                  className="font-pirata text-5xl drop-shadow-[0_0_20px_currentColor]"
                  style={{ color: lastSlot !== null ? SLOT_COLORS[lastSlot] : "#ec4899" }}
                >
                  {MULTIPLIERS[lastSlot ?? 4]}x WIN!
                </div>
                <div className="text-xl font-mono text-white mt-1">
                  +{winAmount.toFixed(2)}
                </div>
              </div>
            ) : (
              <div>
                <div className="font-pirata text-4xl text-gray-500">
                  {MULTIPLIERS[lastSlot ?? 0]}x
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  -{(betAmount - winAmount).toFixed(2)}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PlinkoBoard;
