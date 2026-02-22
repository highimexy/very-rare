import { useState } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { useBalance } from "../context/BalanceContext";

interface SidePanelProps {
  onBet: (amount: number) => void;
  isGameActive: boolean;
  theme?: "red" | "emerald" | "purple";
}

function SidePanel({ onBet, isGameActive, theme = "red" }: SidePanelProps) {
  const { balance } = useBalance();
  const [betInput, setBetInput] = useState<string>("");

  const styles = {
    red: {
      icon: "text-red-500",
      text: "hover:text-red-500",
      btn: "bg-red-600 hover:bg-red-500 border-red-800 shadow-[0_0_20px_rgba(220,38,38,0.3)]",
    },
    emerald: {
      icon: "text-emerald-500",
      text: "hover:text-emerald-500",
      btn: "bg-emerald-600 hover:bg-emerald-500 border-emerald-800 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    },
    purple: {
      icon: "text-purple-500",
      text: "hover:text-purple-500",
      btn: "bg-purple-600 hover:bg-purple-500 border-purple-800 shadow-[0_0_20px_rgba(147,51,234,0.3)]",
    },
  }[theme];

  const handleHalf = () => {
    if (!betInput) return;
    setBetInput((prev) => (Number(prev) / 2).toFixed(2));
  };

  const handleDouble = () => {
    if (!betInput) return;
    const doubled = Number(betInput) * 2;
    setBetInput(Math.min(doubled, balance).toFixed(2));
  };

  const handleMax = () => {
    setBetInput(balance.toFixed(2));
  };

  const handleBetClick = () => {
    const amount = parseFloat(betInput);
    if (isNaN(amount) || amount <= 0) {
      alert("Wpisz poprawną stawkę!");
      return;
    }
    if (amount > balance) {
      alert("Nie masz tyle kasy!");
      return;
    }
    onBet(amount);
  };

  return (
    <div className="flex flex-col gap-1 text-white w-full">
      <h1 className="font-bold text-sm uppercase tracking-wider ">
        Bet Amount
      </h1>
      <div className="bg-[#1e0b37] p-1 pr-3 rounded-sm flex flex-col gap-2 shadow-inner">
        <div className="flex items-center">
          <div className="relative grow">
            <input
              type="number"
              value={betInput}
              disabled={isGameActive}
              onChange={(e) => setBetInput(e.target.value)}
              className={`
                p-2 pl-4 pr-10 bg-[#10061f] outline-none rounded-sm w-full placeholder:text-gray-300
                [appearance:textfield] 
                [&::-webkit-inner-spin-button]:appearance-none 
                [&::-webkit-outer-spin-button]:appearance-none
                ${isGameActive ? "opacity-50 cursor-not-allowed" : "text-white"}
              `}
              placeholder="0.00"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
              <HiOutlineCurrencyDollar className={`text-2xl ${styles.icon}`} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <button
              onClick={handleHalf}
              disabled={isGameActive}
              className={`px-3 cursor-pointer text-white ${styles.text} transition-colors disabled:opacity-30`}
            >
              1/2
            </button>
            <button
              onClick={handleDouble}
              disabled={isGameActive}
              className={`px-3 border-l-2 border-[#10061f] cursor-pointer ${styles.text} transition-colors disabled:opacity-30`}
            >
              x2
            </button>
            <button
              onClick={handleMax}
              disabled={isGameActive}
              className={`px-3 border-l-2 border-[#10061f] cursor-pointer ${styles.text} transition-colors disabled:opacity-30`}
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="w-full pt-4">
        <button
          onClick={handleBetClick}
          disabled={isGameActive}
          className={`
            w-full h-[60px] p-2 rounded-sm font-bold transition-all cursor-pointer uppercase tracking-widest
            ${
              isGameActive
                ? "bg-gray-800 text-gray-500 cursor-not-allowed border-none"
                : `${styles.btn} text-white active:scale-95 border-b-4`
            }
          `}
        >
          {isGameActive ? "Game in Progress" : "Place Bet"}
        </button>
      </div>

      {/* SESSION STATS */}
      <div className="mt-8">
        <h1 className="font-bold mb-2 text-sm uppercase tracking-wider">
          Session Stats
        </h1>
        <div className="bg-[#1e0b37] p-1 rounded-sm">
          <div className="bg-[#10061f] w-full h-32 rounded-sm flex flex-col items-center justify-center border border-[#1e0b37] border-dashed">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
              Profit / Loss
            </span>
            <span className={`text-xl font-mono font-bold ${styles.icon}`}>
              0.00x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
