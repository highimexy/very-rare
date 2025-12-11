import { Link } from "react-router-dom";
import JokerLeft from "./assets/jokerLeft.png";
import Joker from "./assets/joker.png";

function App() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <img src={Joker} className="w-[400px] scale-x-[-1]"></img>
        </div>
        <div className="flex gap-10 flex-col md:flex-row mb-10">
          <Link
            to="/BlackJack"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-600 no-underline hover:underline transition duration-200"
          >
            BlackJack
          </Link>

          <Link
            to="/Mines"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-600 no-underline hover:underline transition duration-200"
          >
            Mines
          </Link>

          <Link
            to="/Plinko"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-600 no-underline hover:underline transition duration-200"
          >
            Plinko
          </Link>

          <Link
            to="/SimpleSlot"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-600 no-underline hover:underline transition duration-200"
          >
            SimpleSlot
          </Link>

          <Link
            to="/HardSlot"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-600 no-underline hover:underline transition duration-200"
          >
            HardSlot
          </Link>
        </div>
        <div>
          <img src={JokerLeft} className="w-[400px] scale-x-[-1]"></img>
        </div>
      </div>
    </>
  );
}

export default App;
