import { useState } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

function SidePanel() {
  const [betAmount, setBetAmount] = useState("");
  const balance = 5000.0; // Przykładowy balans do przycisku Max

  // Logika przycisków
  const handleHalf = () =>
    setBetAmount((prev) => (Number(prev) / 2).toFixed(2));
  const handleDouble = () =>
    setBetAmount((prev) => (Number(prev) * 2).toFixed(2));
  const handleMax = () => setBetAmount(balance.toFixed(2));

  return (
    <div className="flex flex-col gap-1 text-white w-full">
      <h1 className="font-bold">Bet Amount</h1>
      <div className="bg-[#1e0b37] p-1 pr-3 rounded-sm flex flex-col gap-2">
        <div className="flex items-center">
          <div className="relative grow">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="
                p-2 pl-4 pr-10 bg-[#10061f] outline-none rounded-sm w-full placeholder:text-white
                [appearance:textfield] 
                [&::-webkit-inner-spin-button]:appearance-none 
                [&::-webkit-outer-spin-button]:appearance-none 
              "
              placeholder="0.00"
            />
            <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
              <HiOutlineCurrencyDollar className="text-2xl" />
            </div>
          </div>

          <button
            onClick={handleHalf}
            className="pl-2 pr-2 cursor-pointer text-white hover:bg-[#10061f] transition-colors h-full"
          >
            1/2
          </button>
          <button
            onClick={handleDouble}
            className="pl-2 pr-2 border-l-2 border-[#10061f] cursor-pointer text-white hover:bg-[#10061f] transition-colors h-full"
          >
            x2
          </button>
          <button
            onClick={handleMax}
            className="pl-2 border-l-2 border-[#10061f] cursor-pointer text-white hover:bg-[#10061f] transition-colors h-full"
          >
            Max
          </button>
        </div>
      </div>

      <div className="w-full pt-4">
        <button className="w-full h-[60px] p-2 bg-[#1e0b37] hover:bg-[#10061f] rounded-sm text-white font-bold transition-colors cursor-pointer">
          Bet
        </button>
      </div>

      {/* MIEJSCE NA WYKRES */}
      <div className="mt-6">
        <h1 className="font-bold mb-2">Session Stats</h1>
        <div className="bg-[#1e0b37] p-1 rounded-sm">
          <div className="bg-[#10061f] w-full h-32 rounded-sm flex items-center justify-center border border-[#1e0b37] border-dashed">
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              Chart Placeholder
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
