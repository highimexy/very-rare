import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex gap-10 flex-col md:flex-row mb-10">
          <Link
            to="/BlackJack"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-900 no-underline hover:underline transition duration-200"
          >
            BlackJack
          </Link>

          <Link
            to="/Mines"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-900 no-underline hover:underline transition duration-200"
          >
            Mines
          </Link>

          <Link
            to="/Plinko"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-900 no-underline hover:underline transition duration-200"
          >
            Plinko
          </Link>

          <Link
            to="/SimpleSlot"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-900 no-underline hover:underline transition duration-200"
          >
            SimpleSlot
          </Link>

          <Link
            to="/HardSlot"
            className="text-7xl font-pirata  rounded-2xl  hover:text-purple-900 no-underline hover:underline transition duration-200"
          >
            HardSlot
          </Link>
        </div>
      </div>
    </>
  );
}

export default App;
