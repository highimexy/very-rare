import { useState, useEffect } from "react";
import { FaGem, FaBomb } from "react-icons/fa";

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

  // Obliczanie mnożnika na podstawie statystyki
  const getMultiplier = (found: number) => {
    if (found === 0) return 1.0;
    let multiplier = 1.0;
    for (let i = 0; i < found; i++) {
      multiplier *= (25 - i) / (25 - minesCount - i);
    }
    return parseFloat((multiplier * 0.98).toFixed(2)); // 0.98 to prowizja kasyna
  };

  const currentMultiplier = getMultiplier(gemsFound);

  // Automatyczny start gry, gdy nadrzędny Mines.tsx zmieni isGameActive na true
  useEffect(() => {
    if (isGameActive && !isGameOver && gemsFound === 0) {
      generateMines();
    }
  }, [isGameActive]);

  const generateMines = () => {
    const locations: number[] = [];
    while (locations.length < minesCount) {
      const randomPos = Math.floor(Math.random() * 25);
      if (!locations.includes(randomPos)) {
        locations.push(randomPos);
      }
    }
    setMineLocations(locations);
    setGrid(Array(25).fill(null));
    setIsGameOver(false);
    setGemsFound(0);
  };

  const handleTileClick = (index: number): void => {
    if (!isGameActive || isGameOver || grid[index] !== null) return;

    const newGrid = [...grid];
    if (mineLocations.includes(index)) {
      // TRAFIONA BOMBA
      newGrid[index] = "bomb";
      setGrid(newGrid);
      setIsGameOver(true);
      revealFullBoard(newGrid);
      // Informujemy system o przegranej (wygrana = 0)
      setTimeout(() => onGameEnd(0), 1500);
    } else {
      // TRAFIONY DIAMENT
      newGrid[index] = "gem";
      setGrid(newGrid);
      setGemsFound((prev) => prev + 1);
    }
  };

  const revealFullBoard = (currentGrid: TileType[]): void => {
    const finalGrid = currentGrid.map((tile, idx) => {
      if (mineLocations.includes(idx)) return "bomb" as TileType;
      return tile; // Pokazuje odkryte diamenty, reszta zostaje zakryta/null
    });
    setGrid(finalGrid);
  };

  const handleCashOut = () => {
    const winAmount = betAmount * currentMultiplier;

    // 1. Prześlij wygraną do portfela i zakończ stan gry w Mines.tsx
    onGameEnd(winAmount);

    // 2. Zresetuj lokalną planszę
    setGrid(Array(25).fill(null));
    setMineLocations([]);
    setGemsFound(0);
    setIsGameOver(false);
  };

  const resetAfterLoss = () => {
    setGrid(Array(25).fill(null));
    setIsGameOver(false);
    setGemsFound(0);
    onGameEnd(0); // Resetuje stan aktywności gry w Mines.tsx
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[600px] aspect-square">
      {/* PANEL MNOŻNIKA I CASH OUT (Widoczny w trakcie gry) */}
      {isGameActive && !isGameOver && gemsFound > 0 && (
        <div className="absolute -top-16 w-full flex justify-between items-center bg-neutral-900/80 p-3 rounded-lg border border-emerald-500/30 z-20">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold">
              Profit ({currentMultiplier}x)
            </span>
            <span className="text-xl text-emerald-400 font-mono font-bold">
              {(betAmount * currentMultiplier).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCashOut}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] font-bold transition-all cursor-pointer active:scale-95"
          >
            CASH OUT
          </button>
        </div>
      )}

      {/* NAKŁADKA CENTRALNA (Start / Game Over) */}
      {(!isGameActive || isGameOver) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl transition-all">
          {!isGameActive && !isGameOver ? (
            // Informacja przed startem (Przycisk jest teraz w SidePanelu, więc tu tylko info)
            <div className="  inset-0 absolute flex items-center justify-center rounded-xl">
              <span className="font-pirata text-4xl text-white animate-pulse">
                Place Bet to Play
              </span>
            </div>
          ) : isGameOver ? (
            // Przycisk RESTART po przegranej
            <button
              onClick={resetAfterLoss}
              className="flex flex-col items-center bg-red-600/90 hover:bg-red-500 text-white px-16 py-8 
                         rounded-md shadow-[0_0_50px_rgba(220,38,38,0.5)] 
                         transition-all active:scale-95 cursor-pointer group"
            >
              <span className="font-pirata text-5xl tracking-tighter mb-2">
                GAME OVER
              </span>
              <span className="font-sans font-bold text-sm uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100">
                Restart
              </span>
            </button>
          ) : null}
        </div>
      )}

      {/* SIATKA GRY */}
      <div
        className={`grid grid-cols-5 gap-3 w-full h-full transition-opacity ${!isGameActive && !isGameOver ? "opacity-40" : "opacity-100"}`}
      >
        {grid.map((tile, i) => (
          <button
            key={i}
            onClick={() => handleTileClick(i)}
            disabled={!isGameActive || isGameOver}
            className={`
              cursor-pointer aspect-square rounded-lg flex items-center justify-center text-4xl
              transition-all duration-200 shadow-xl border-b-[6px]
              ${
                tile === null
                  ? "bg-[#1e0b37] border-[#10061f] hover:bg-[#2d1252] hover:-translate-y-1"
                  : tile === "gem"
                    ? "bg-emerald-500/20 border-emerald-600 text-emerald-400"
                    : "bg-red-500/20 border-red-600 text-red-400"
              }
            `}
          >
            {tile === "gem" && (
              <FaGem className="drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            )}
            {tile === "bomb" && (
              <FaBomb className="drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MinesBoard;
