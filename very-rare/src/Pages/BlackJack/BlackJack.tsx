import { useState } from "react";
import Balance from "../../Components/Balance";
import SidePanel from "../../Components/SidePanel";
import Joker from "../../assets/joker.png";
import JokerLeft from "../../assets/jokerLeft.png";
import BlackJackBoard from "./BlackJackBoard.tsx";
import { useBalance } from "../../context/BalanceContext";
import BackButton from "../../Components/BackButton.tsx";

function BlackJack() {
  const { subtractBet, addWin } = useBalance();

  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [currentBet, setCurrentBet] = useState<number>(0);

  const handlePlaceBet = (amount: number) => {
    const success = subtractBet(amount);

    if (success) {
      setCurrentBet(amount);
      setIsGameActive(true);
    } else {
      alert("Niewystarczające środki na koncie!");
    }
  };

  const handleGameEnd = (winAmount: number = 0) => {
    if (winAmount > 0) {
      addWin(winAmount);
    }
    setIsGameActive(false);
    setCurrentBet(0);
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white p-2 overflow-x-hidden">
      <BackButton theme="emerald" />
      <div className="flex justify-center p-2">
        <div className="flex flex-row items-center">
          <img
            src={Joker}
            className="w-[80px] md:w-[120px] scale-x-[-1]"
            alt="Joker"
          />
          <h1 className="text-5xl md:text-8xl font-pirata px-4 hover:text-emerald-500 transition duration-300 cursor-default">
            Black Jack
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
        {/* PANEL BOCZNY */}
        <div className="md:w-104 w-full shrink-0 p-8 border-4 border-[#1e0b37] rounded-lg shadow-2xl">
          {/* Używamy tego samego SidePanelu! */}
          <SidePanel
            onBet={handlePlaceBet}
            isGameActive={isGameActive}
            theme="emerald"
          />
        </div>

        {/* STÓŁ DO GRY */}
        <div className="flex grow items-center justify-center p-8 border-4 border-[#1e0b37] rounded-lg relative overflow-hidden">
          {/* Kasynowa, zielona poświata w tle */}
          <div className="absolute w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] pointer-events-none rounded-full"></div>

          <BlackJackBoard
            betAmount={currentBet}
            isGameActive={isGameActive}
            onGameEnd={handleGameEnd}
          />
        </div>
      </div>
    </div>
  );
}

export default BlackJack;
