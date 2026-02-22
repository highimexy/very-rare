import { useState } from "react";

function MinesBoard() {
  const [revealed, setRevealed] = useState(Array(25).fill(false));

  const handleSquareClick = (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    console.log(`Kliknięto pole nr: ${index}`);
  };

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-2 w-full max-w-[500px] aspect-square p-2 bg-[#1e0b37]/30 rounded-xl border border-white/5 shadow-2xl">
      {revealed.map((isRevealed, index) => (
        <button
          key={index}
          onClick={() => handleSquareClick(index)}
          disabled={isRevealed}
          className={`
            relative rounded-md transition-all duration-200 transform cursor-pointer
            ${
              isRevealed
                ? "bg-[#10061f] scale-95 shadow-inner"
                : "bg-[#1e0b37] hover:bg-[#2d1252] hover:scale-105 active:scale-90 shadow-lg"
            }
            flex items-center justify-center overflow-hidden group
          `}
        >
          {/* Efekt poświaty na nieodkrytych polach */}
          {!isRevealed && (
            <div className=" absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          )}

          {/* Zawartość pola (później tu będą ikony) */}
          {isRevealed && (
            <span className="text-white font-bold animate-appear">💎</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default MinesBoard;
