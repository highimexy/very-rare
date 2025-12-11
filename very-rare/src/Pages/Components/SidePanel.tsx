import { HiOutlineCurrencyDollar } from "react-icons/hi";

function SidePanel() {
  return (
    <>
      <h1 className="font-bold">Bet Amount</h1>
      <div className="bg-[#1e0b37] p-1 pr-3 rounded-sm flex flex-col gap-2">
        <div className="flex items-center">
          <div className="relative grow">
            <input
              type="number"
              className="
                p-2 pl-4 pr-10 bg-[#10061f] outline-none rounded-sm w-full placeholder:text-white
                [appearance:textfield] 
                [&::-webkit-inner-spin-button]:appearance-none 
                [&::-webkit-outer-spin-button]:appearance-none 
              "
              placeholder="0.00"
            />

            <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
              <HiOutlineCurrencyDollar className=" text-2xl" />
            </div>
          </div>

          <button className="pl-2 pr-2 cursor-pointer text-white">1/2</button>

          <button className="pl-2 pr-2 border-l-2 border-[#10061f] cursor-pointer text-white">
            x2
          </button>

          <button className="pl-2 border-l-2 border-[#10061f] cursor-pointer text-white">
            Max
          </button>
        </div>
      </div>
      <div className="w-full pt-4">
        <button className="w-full h-[60px] p-2 bg-[#1e0b37] hover:bg-[#10061f] rounded-sm text-white font-bold transition-colors cursor-pointer">
          Bet
        </button>
      </div>
    </>
  );
}

export default SidePanel;
