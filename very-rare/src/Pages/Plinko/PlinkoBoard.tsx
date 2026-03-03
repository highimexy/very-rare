import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";

const ROWS = 8;
const SLOTS = ROWS + 1; // 9 slots

const MULTIPLIERS = [0.2, 0.5, 1.0, 2.0, 10.0, 2.0, 1.0, 0.5, 0.2];

const SLOT_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#10b981",
  "#22c55e", "#eab308", "#f97316", "#ef4444",
];

const BOARD_W = 360;
const BOARD_H = 420;
const SLOT_W = BOARD_W / SLOTS;
const SLOT_AREA_H = 56;
const ROW_H = (BOARD_H - SLOT_AREA_H - 20) / (ROWS + 1);
const PEG_R = 5;
const BALL_R = 9;

const pegCX = (r: number, p: number) => BOARD_W / 2 + (p - r / 2) * SLOT_W;
const pegCY = (r: number) => 20 + (r + 1) * ROW_H;

const computePath = (): { waypoints: { x: number; y: number }[]; slot: number } => {
  const waypoints: { x: number; y: number }[] = [];
  waypoints.push({ x: BOARD_W / 2, y: 0 });

  let p = 0;
  for (let r = 0; r < ROWS; r++) {
    waypoints.push({ x: pegCX(r, p), y: pegCY(r) });
    if (Math.random() < 0.5) p += 1;
  }

  const slot = p;
  waypoints.push({ x: (slot + 0.5) * SLOT_W, y: BOARD_H - SLOT_AREA_H / 2 });
  return { waypoints, slot };
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

  // MotionValues live outside React render cycle — always in sync
  const ballX = useMotionValue(BOARD_W / 2 - BALL_R);
  const ballY = useMotionValue(-BALL_R * 2);
  const ballOpacity = useMotionValue(0);

  const stopRef = useRef(false);
  const activeAnims = useRef<ReturnType<typeof animate>[]>([]);

  const stopAll = () => {
    stopRef.current = true;
    activeAnims.current.forEach((a) => a.stop());
    activeAnims.current = [];
    ballOpacity.set(0);
  };

  useEffect(() => {
    if (isGameActive && gameState === "idle") {
      stopRef.current = false;
      dropBall();
    }
    if (!isGameActive) {
      stopAll();
      setGameState("idle");
      setLastSlot(null);
      setWinAmount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameActive]);

  const dropBall = async () => {
    const { waypoints, slot } = computePath();
    setGameState("dropping");

    // Snap to start, make ball visible
    ballX.set(waypoints[0].x - BALL_R);
    ballY.set(waypoints[0].y - BALL_R);
    ballOpacity.set(1);

    // Animate step-by-step through waypoints (gravity feel)
    for (let i = 1; i < waypoints.length; i++) {
      if (stopRef.current) return;

      const wp = waypoints[i];
      const isFirst = i === 1;
      const isLast = i === waypoints.length - 1;
      const duration = isFirst ? 0.38 : isLast ? 0.42 : 0.21;
      const ease = isLast ? "easeOut" : "easeIn";

      const ax = animate(ballX, wp.x - BALL_R, { duration, ease });
      const ay = animate(ballY, wp.y - BALL_R, { duration, ease });
      activeAnims.current = [ax, ay];
      await Promise.all([ax, ay]);
    }

    if (stopRef.current) return;

    // Fade ball out
    const fo = animate(ballOpacity, 0, { duration: 0.22 });
    activeAnims.current = [fo];
    await fo;

    if (stopRef.current) return;

    const multiplier = MULTIPLIERS[slot];
    const win = parseFloat((betAmount * multiplier).toFixed(2));
    setLastSlot(slot);
    setWinAmount(win);
    setGameState("result");

    setTimeout(() => {
      if (!stopRef.current) {
        onGameEnd(win);
        setGameState("idle");
      }
    }, 2500);
  };

  // Build peg list for SVG
  const pegs: { cx: number; cy: number; key: string }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let p = 0; p <= r; p++) {
      pegs.push({ cx: pegCX(r, p), cy: pegCY(r), key: `${r}-${p}` });
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Idle message */}
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

      {/* Board */}
      <div
        className="relative rounded-2xl border-4 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.25),inset_0_0_40px_rgba(236,72,153,0.04)] overflow-hidden"
        style={{
          width: BOARD_W,
          height: BOARD_H,
          background: "linear-gradient(to bottom, #1a0a2e, #0d0620)",
        }}
      >
        {/* Static SVG layer: pegs + slots */}
        <svg
          width={BOARD_W}
          height={BOARD_H}
          className="absolute inset-0 pointer-events-none"
        >
          <defs>
            <filter id="pegGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="slotGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {pegs.map((peg) => (
            <circle
              key={peg.key}
              cx={peg.cx}
              cy={peg.cy}
              r={PEG_R}
              fill="#ec4899"
              opacity={0.8}
              filter="url(#pegGlow)"
            />
          ))}

          {MULTIPLIERS.map((mult, i) => {
            const x = i * SLOT_W;
            const y = BOARD_H - SLOT_AREA_H;
            const isWin = lastSlot === i;
            return (
              <g key={i} filter={isWin ? "url(#slotGlow)" : undefined}>
                <rect
                  x={x + 1}
                  y={y + 2}
                  width={SLOT_W - 2}
                  height={SLOT_AREA_H - 4}
                  rx={5}
                  fill={SLOT_COLORS[i]}
                  opacity={isWin ? 1 : 0.2}
                  style={{ transition: "opacity 0.4s" }}
                />
                <text
                  x={x + SLOT_W / 2}
                  y={y + SLOT_AREA_H / 2 + 5}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill={isWin ? "#fff" : SLOT_COLORS[i]}
                  opacity={isWin ? 1 : 0.85}
                  style={{ transition: "all 0.4s", userSelect: "none" }}
                >
                  {mult}x
                </text>
              </g>
            );
          })}
        </svg>

        {/* Ball — always mounted, opacity controlled via MotionValue */}
        <motion.div
          style={{
            x: ballX,
            y: ballY,
            opacity: ballOpacity,
            position: "absolute",
            top: 0,
            left: 0,
            width: BALL_R * 2,
            height: BALL_R * 2,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 32% 28%, #ffffff, #f9a8d4, #ec4899)",
            boxShadow:
              "0 0 8px rgba(236,72,153,1), 0 0 20px rgba(236,72,153,0.7), 0 0 40px rgba(236,72,153,0.3)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Multiplier pills */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {MULTIPLIERS.map((m, i) => (
          <div
            key={i}
            className="text-xs px-2 py-0.5 rounded-full font-bold border"
            style={{
              color: SLOT_COLORS[i],
              borderColor: SLOT_COLORS[i] + "55",
              backgroundColor:
                lastSlot === i ? SLOT_COLORS[i] + "35" : SLOT_COLORS[i] + "12",
              boxShadow: lastSlot === i ? `0 0 10px ${SLOT_COLORS[i]}` : "none",
              transform: lastSlot === i ? "scale(1.15)" : "scale(1)",
              transition: "all 0.3s",
            }}
          >
            {m}x
          </div>
        ))}
      </div>

      {/* Result */}
      <AnimatePresence>
        {gameState === "result" && lastSlot !== null && (
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
                  style={{ color: SLOT_COLORS[lastSlot] }}
                >
                  {MULTIPLIERS[lastSlot]}x WIN!
                </div>
                <div className="text-xl font-mono text-white mt-1">
                  +{winAmount.toFixed(2)}
                </div>
              </div>
            ) : (
              <div>
                <div
                  className="font-pirata text-4xl"
                  style={{ color: SLOT_COLORS[lastSlot] }}
                >
                  {MULTIPLIERS[lastSlot]}x
                </div>
                <div className="text-sm text-gray-500 mt-1">
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
