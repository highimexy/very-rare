import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="text-center flex flex-col h-full ">
        <h1 className="text-4xl">HOME</h1>
        <div className="flex gap-4 flex-row ">
          <Link
            to="/BlackJack"
            className="border-2 p-2 rounded-2xl hover:border-2 hover:border-purple-950"
          >
            BlackJack
          </Link>

          <Link
            to="/Mines"
            className="border-2 p-2 rounded-2xl hover:border-2 hover:border-purple-950"
          >
            Mines
          </Link>

          <Link
            to="/Plinko"
            className="border-2 p-2 rounded-2xl hover:border-2 hover:border-purple-950"
          >
            Plinko
          </Link>

          <Link
            to="/SimpleSlot"
            className="border-2 p-2 rounded-2xl hover:border-2 hover:border-purple-950"
          >
            SimpleSlot
          </Link>

          <Link
            to="/HardSlot"
            className="border-2 p-2 rounded-2xl hover:border-2 hover:border-purple-950"
          >
            HardSlot
          </Link>
        </div>
      </div>
    </>
  );
}

export default App;
