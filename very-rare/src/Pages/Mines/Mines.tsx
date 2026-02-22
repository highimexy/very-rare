import { useState } from "react";
import Balance from "../../Components/Balance";
import SidePanel from "../../Components/SidePanel";
import Joker from "../../assets/joker.png";
import JokerLeft from "../../assets/jokerLeft.png";
import MinesBoard from "./MinesBoard";
import { useBalance } from "../../context/BalanceContext";

function Mines() {
  const { subtractBet, addWin } = useBalance();

  // Stan zarządzający przebiegiem gry
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [currentBet, setCurrentBet] = useState<number>(0);

  // Funkcja wywoływana przez przycisk "Bet" w SidePanel
  const handlePlaceBet = (amount: number) => {
    const success = subtractBet(amount); // Próba pobrania środków z BalanceContext

    if (success) {
      setCurrentBet(amount);
      setIsGameActive(true); // Odblokowuje planszę i blokuje SidePanel
    } else {
      alert("Niewystarczające środki na koncie!");
    }
  };

  // Funkcja kończąca grę (wygrana/przegrana)
  const handleGameEnd = (winAmount: number = 0) => {
    if (winAmount > 0) {
      addWin(winAmount); // Dodaje wygraną do BalanceContext
    }
    setIsGameActive(false); // Odblokowuje SidePanel
    setCurrentBet(0);
  };

  return (
    <div className="flex flex-col min-h-screen  text-white p-2 overflow-x-hidden">
      {/* NAGŁÓWEK */}
      <div className="flex justify-center p-2">
        <div className="flex flex-row items-center">
          <img
            src={Joker}
            className="w-[80px] md:w-[120px] scale-x-[-1]"
            alt="Joker"
          />
          <h1 className="text-5xl md:text-8xl font-pirata px-4 hover:text-red-600 transition duration-300 cursor-default">
            Mines
          </h1>
          <img
            src={JokerLeft}
            className="w-[80px] md:w-[120px] scale-x-[-1]"
            alt="Joker Left"
          />
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <Balance />
      </div>

      {/* GŁÓWNY UKŁAD */}
      <div className="flex grow flex-col md:flex-row gap-6 lg:px-20 pb-10">
        {/* PANEL BOCZNY STEROWANIA */}
        <div className="md:w-104 w-full shrink-0 p-8 border-4 border-[#1e0b37]  rounded-lg shadow-2xl">
          <SidePanel onBet={handlePlaceBet} isGameActive={isGameActive} />
        </div>

        {/* PLANSZA GRY */}
        <div className="flex grow items-center justify-center p-8 border-4 border-[#1e0b37]  rounded-lg relative overflow-hidden">
          <MinesBoard
            betAmount={currentBet}
            isGameActive={isGameActive}
            onGameEnd={handleGameEnd}
          />
        </div>
      </div>
    </div>
  );
}

export default Mines;
