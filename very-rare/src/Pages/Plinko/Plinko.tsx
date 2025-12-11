import Balance from "../Components/Balance";
import SidePanel from "../Components/SidePanel";
import Joker from "../../assets/joker.png";
import JokerLeft from "../../assets/jokerLeft.png";

function Plinko() {
  return (
    <>
      <div className="flex flex-col min-h-screen p-2">
        <div className="flex justify-center p-2 ">
          <div className="flex flex-row items-center">
            <img
              src={Joker}
              className="w-[100px] scale-x-[-1] "
            ></img>
            <h1 className="text-7xl font-pirata rounded-2xl cursor-crosshair hover:text-[#1e0b37] no-underline hover:underline transition duration-200">
              Black Jack
            </h1>
            <img src={JokerLeft} className="w-[100px] scale-x-[-1]"></img>
          </div>
        </div>

        <div className="flex justify-center">
          <Balance />
        </div>

        <div className="flex grow flex-col md:flex-row gap-4 md:p-20">
          <div className="md:w-104 w-full shrink-0 p-8 border-4 border-[#1e0b37] rounded-lg mx-auto md:mx-0 inset-0">
            <SidePanel />
          </div>

          <div className="flex grow items-center justify-center p-8 border-4 border-[#1e0b37] rounded-lg">
            <div className="p-8">
              <h1 className="text-4xl font-bold">GRA</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Plinko;
