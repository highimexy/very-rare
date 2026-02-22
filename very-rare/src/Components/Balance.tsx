import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { useBalance } from "../context/BalanceContext";

function Balance() {
  const { balance } = useBalance();

  return (
    <div className="w-40 text-center text-white">
      <h1 className="font-bold mb-1  text-xs uppercase">Balance</h1>
      <div className="bg-[#1e0b37] p-1 rounded-sm">
        <div className="relative bg-[#10061f] p-2 pl-10 pr-4 flex items-center h-full text-sm font-mono ">
          <HiOutlineCurrencyDollar className="absolute left-3 text-[20px]" />
          {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}

export default Balance;
