import { useState } from "react";
import Balance from "../../Components/Balance";
import SidePanel, { type SessionEntry } from "../../Components/SidePanel";
import Joker from "../../assets/joker.png";
import JokerLeft from "../../assets/jokerLeft.png";
import HardSlotBoard from "./HardSlotBoard";
import { useBalance } from "../../context/BalanceContext";
import BackButton from "../../Components/BackButton";

function HardSlot() {
  const { subtractBet, addWin } = useBalance();
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [currentBet, setCurrentBet] = useState<number>(0);
  const [sessionHistory, setSessionHistory] = useState<SessionEntry[]>([]);

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
    if (winAmount > 0) addWin(winAmount);
    setSessionHistory((prev) => [...prev, { net: winAmount - currentBet }]);
    setIsGameActive(false);
    setCurrentBet(0);
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white p-2 overflow-x-hidden">
      <BackButton theme="orange" />

      <div className="flex justify-center p-2">
        <div className="flex flex-row items-center">
          <img src={Joker} className="w-20px md:w-[120px] scale-x-[-1]" alt="Joker" />
          <h1 className="text-5xl md:text-8xl font-pirata px-4 hover:text-orange-500 transition duration-300 cursor-default">
            Hard Slot
          </h1>
          <img src={JokerLeft} className="w-20px md:w-[120px] scale-x-[-1]" alt="Joker Left" />
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <Balance />
      </div>

      <div className="flex grow flex-col md:flex-row gap-6 lg:px-20 pb-10">
        <div className="md:w-104 w-full shrink-0 p-8 border-4 border-[#1e0b37] rounded-lg shadow-2xl">
          <SidePanel
            onBet={handlePlaceBet}
            isGameActive={isGameActive}
            theme="orange"
            sessionHistory={sessionHistory}
          />
        </div>

        <div className="flex grow items-center justify-center p-8 border-4 border-[#1e0b37] rounded-lg relative overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-orange-600/5 blur-[120px] pointer-events-none rounded-full" />
          <HardSlotBoard
            betAmount={currentBet}
            isGameActive={isGameActive}
            onGameEnd={handleGameEnd}
          />
        </div>
      </div>
    </div>
  );
}

export default HardSlot;
