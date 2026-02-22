import { Link } from "react-router-dom";
import JokerLeft from "./assets/jokerLeft.png";
import Joker from "./assets/joker.png";
import Balance from "./Components/Balance";
import User from "./Components/User";

function App() {
  const games = [
    {
      name: "BlackJack",
      path: "/BlackJack",
      color:
        "hover:text-emerald-500 hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]",
    },
    {
      name: "Mines",
      path: "/Mines",
      color:
        "hover:text-red-500 hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]",
    },
    {
      name: "Plinko",
      path: "/Plinko",
      color:
        "hover:text-pink-500 hover:drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]",
    },
    {
      name: "SimpleSlot",
      path: "/SimpleSlot",
      color:
        "hover:text-yellow-400 hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]",
    },
    {
      name: "HardSlot",
      path: "/HardSlot",
      color:
        "hover:text-orange-600 hover:drop-shadow-[0_0_15px_rgba(234,88,12,0.6)]",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col overflow-x-hidden font-sans">
      {/* GÓRNY PASEK */}
      <header className="w-full p-6 flex flex-col md:flex-row justify-between items-center gap-6 z-10">
        <div className="text-4xl md:text-5xl font-pirata tracking-widest text-purple-600 drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]">
          VERY - RARE
        </div>

        <div className="flex gap-4">
          <User />
          <Balance />
        </div>
      </header>

      {/* GŁÓWNY CONTENT */}
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center p-4 gap-10">
        {/* Lewy Joker */}
        <div className="hidden lg:block shrink-0">
          <img
            src={Joker}
            className="w-[300px] xl:w-[450px] scale-x-[-1] drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
            alt="Joker Left"
          />
        </div>

        {/* Menu Główne z dynamicznymi kolorami */}
        <nav className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 max-w-4xl">
            {games.map((game) => (
              <Link
                key={game.path}
                to={game.path}
                className={`
                  text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
                  font-pirata no-underline text-white text-center
                  transition-all duration-300 ease-out
                  hover:scale-110 hover:-rotate-3
                  ${game.color}
                `}
              >
                {game.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Prawy Joker */}
        <div className="shrink-0">
          <img
            src={JokerLeft}
            className="w-[250px] sm:w-[350px] xl:w-[450px] scale-x-[-1] drop-shadow-[0_0_30px_rgba(0,0,0,1)]"
            alt="Joker Right"
          />
        </div>
      </main>
    </div>
  );
}

export default App;
