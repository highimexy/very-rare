import { HiOutlineCurrencyDollar } from "react-icons/hi";

function Balance() {
  return (
    <>
      <div className="w-40 text-center">
        <h1 className="font-bold">Balance</h1>
        <div className="bg-[#1e0b37] p-1 rounded-sm flex flex-col gap-2">
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
                placeholder="5000"
              />

              <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none">
                <HiOutlineCurrencyDollar className=" text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Balance;
