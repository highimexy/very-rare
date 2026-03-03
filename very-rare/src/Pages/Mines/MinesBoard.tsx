import { useState, useEffect } from "react";
import { FaGem, FaBomb } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type TileType = null | "gem" | "bomb";

interface MinesBoardProps {
  betAmount: number;
  isGameActive: boolean;
  onGameEnd: (winAmount?: number) => void;
}

function MinesBoard({ betAmount, isGameActive, onGameEnd }: MinesBoardProps) {
  const [grid, setGrid] = useState<TileType[]>(Array(25).fill(null));
  const [mineLocations, setMineLocations] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gemsFound, setGemsFound] = useState<number>(0);
  const [minesCount] = useState<number>(3);
  const [bombHit, setBombHit] = useState<number | null>(null);

  const getMultiplier = (found: number) => {
    if (found === 0) return 1.0;
    let multiplier = 1.0;
    for (let i = 0; i < found; i++) {
      multiplier *= (25 - i) / (25 - minesCount - i);
    }
    return parseFloat((multiplier * 0.98).toFixed(2));
  };

  const currentMultiplier = getMultiplier(gemsFound);

  useEffect(() => {
    if (isGameActive && !isGameOver && gemsFound === 0) {
      generateMines();
    }
  }, [isGameActive]);

  const generateMines = () => {
    const locations: number[] = [];
    while (locations.length < minesCount) {
      const randomPos = Math.floor(Math.random() * 25);
      if (!locations.includes(randomPos)) locations.push(randomPos);
    }
    setMineLocations(locations);
    setGrid(Array(25).fill(null));
    setIsGameOver(false);
    setGemsFound(0);
    setBombHit(null);
  };

  const handleTileClick = (index: number): void => {
    if (!isGameActive || isGameOver || grid[index] !== null) return;

    const newGrid = [...grid];
    if (mineLocations.includes(index)) {
      newGrid[index] = "bomb";
      setGrid(newGrid);
      setIsGameOver(true);
      setBombHit(index);
      setTimeout(() => {
        revealFullBoard(newGrid);
        setTimeout(() => onGameEnd(0), 1500);
      }, 600);
    } else {
      newGrid[index] = "gem";
      setGrid(newGrid);
      setGemsFound((prev) => prev + 1);
    }
  };

  const revealFullBoard = (currentGrid: TileType[]): void => {
    const finalGrid = currentGrid.map((tile, idx) => {
      if (mineLocations.includes(idx)) return "bomb" as TileType;
      return tile;
    });
    setGrid(finalGrid);
  };

  const handleCashOut = () => {
    const winAmount = betAmount * currentMultiplier;
    onGameEnd(winAmount);
    setGrid(Array(25).fill(null));
    setMineLocations([]);
    setGemsFound(0);
    setIsGameOver(false);
    setBombHit(null);
  };

  const resetAfterLoss = () => {
    setGrid(Array(25).fill(null));
    setIsGameOver(false);
    setGemsFound(0);
    setBombHit(null);
    onGameEnd(0);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[600px] aspect-square">
      {/* MULTIPLIER & CASH OUT PANEL */}
      <AnimatePresence>
        {isGameActive && !isGameOver && gemsFound > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -top-16 w-full flex justify-between items-center bg-neutral-900/80 p-3 rounded-lg border border-emerald-500/30 z-20"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-gray-400 font-bold">
                Profit ({currentMultiplier}x)
              </span>
              <span className="text-xl text-emerald-400 font-mono font-bold">
                {(betAmount * currentMultiplier).toFixed(2)}
              </span>
            </div>
            <motion.button
              onClick={handleCashOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] font-bold transition-colors cursor-pointer"
            >
              CASH OUT
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY (Start / Game Over) */}
      <AnimatePresence>
        {(!isGameActive || isGameOver) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center rounded-xl"
          >
            {!isGameActive && !isGameOver ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="absolute inset-0 flex items-center justify-center rounded-xl"
              >
                <span className="font-pirata text-4xl text-white">
                  Place Bet to Play
                </span>
              </motion.div>
            ) : isGameOver ? (
              <motion.button
                onClick={resetAfterLoss}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center bg-red-600/90 hover:bg-red-500 text-white px-16 py-8 rounded-md shadow-[0_0_50px_rgba(220,38,38,0.5)] transition-colors cursor-pointer group"
              >
                <span className="font-pirata text-5xl tracking-tighter mb-2">
                  GAME OVER
                </span>
                <span className="font-sans font-bold text-sm uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100">
                  Restart
                </span>
              </motion.button>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID */}
      <div
        className={`grid grid-cols-5 gap-3 w-full h-full transition-opacity ${!isGameActive && !isGameOver ? "opacity-40" : "opacity-100"}`}
      >
        {grid.map((tile, i) => (
          <motion.button
            key={i}
            onClick={() => handleTileClick(i)}
            disabled={!isGameActive || isGameOver}
            whileHover={
              tile === null && isGameActive && !isGameOver
                ? { y: -6, scale: 1.05 }
                : {}
            }
            whileTap={
              tile === null && isGameActive && !isGameOver
                ? { scale: 0.92 }
                : {}
            }
            animate={
              bombHit === i
                ? {
                    x: [0, -8, 8, -8, 8, 0],
                    transition: { duration: 0.4 },
                  }
                : {}
            }
            className={`
              cursor-pointer aspect-square rounded-lg flex items-center justify-center text-4xl
              shadow-xl border-b-[6px] transition-colors duration-200
              ${
                tile === null
                  ? "bg-[#1e0b37] border-[#10061f] hover:bg-[#2d1252]"
                  : tile === "gem"
                  ? "bg-emerald-500/20 border-emerald-600 text-emerald-400"
                  : "bg-red-500/20 border-red-600 text-red-400"
              }
            `}
          >
            <AnimatePresence>
              {tile === "gem" && (
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <FaGem className="drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                </motion.span>
              )}
              {tile === "bomb" && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1.3, 1],
                    rotate: [0, -15, 15, 0],
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <FaBomb className="drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default MinesBoard;
