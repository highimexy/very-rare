import Balance from "../Components/Balance";
import SidePanel from "../Components/SidePanel";

function BlackJack() {
  return (
    <>
      <div className="flex flex-col min-h-screen p-2">
        <div className="text-center p-6">
          <h1 className="text-7xl font-pirata rounded-2xl cursor-crosshair hover:text-purple-600 no-underline hover:underline transition duration-200">
            Black Jack
          </h1>
        </div>
        <div className="flex justify-center">
          <Balance />
        </div>
        <div className="flex grow items-center justify-center">
          <div className="flex flex-col md:flex-row gap-20 bg-[#0c0c0f] p-10">
            <div className="p-8 border-4 border-[#1e0b37] rounded-lg shadow-xl">
              <SidePanel />
            </div>
            <div className="p-8 border-4 border-[#1e0b37] rounded-lg shadow-xl">
              <h1>GRA</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlackJack;
