import { useState, useEffect } from "react";

interface BlackJackBoardProps {
  betAmount: number;
  isGameActive: boolean;
  onGameEnd: (winAmount?: number) => void;
}

type Card = { suit: string; value: string; weight: number };

function BlackJackBoard({
  betAmount,
  isGameActive,
  onGameEnd,
}: BlackJackBoardProps) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  // Usunąłem "dealerTurn", bo całą logikę krupiera załatwimy w jednym ruchu
  const [gameState, setGameState] = useState<
    "betting" | "playing" | "gameOver"
  >("betting");
  const [message, setMessage] = useState<string>("");
  const [winMultiplier, setWinMultiplier] = useState<number>(0);

  // Generowanie i tasowanie talii
  const generateDeck = () => {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    const newDeck: Card[] = [];

    suits.forEach((suit) => {
      values.forEach((value) => {
        let weight = parseInt(value);
        if (["J", "Q", "K"].includes(value)) weight = 10;
        if (value === "A") weight = 11;
        newDeck.push({ suit, value, weight });
      });
    });

    return newDeck.sort(() => Math.random() - 0.5);
  };

  const calculateScore = (hand: Card[]) => {
    let score = 0;
    let aces = 0;
    hand.forEach((card) => {
      score += card.weight;
      if (card.value === "A") aces += 1;
    });
    // Zbijanie wartości Asów z 11 na 1, jeśli przekraczamy 21
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  // Funkcja pomocnicza do kończenia gry
  const endGame = (msg: string, multiplier: number) => {
    setGameState("gameOver");
    setMessage(msg);
    setWinMultiplier(multiplier);
  };

  // Start gry na sygnał z SidePanelu (kiedy isGameActive zmienia się na true)
  useEffect(() => {
    if (isGameActive && gameState === "betting") {
      const newDeck = generateDeck();
      const pHand = [newDeck.pop()!, newDeck.pop()!];
      const dHand = [newDeck.pop()!, newDeck.pop()!];

      setDeck(newDeck);
      setPlayerHand(pHand);
      setDealerHand(dHand);
      setMessage("");
      setWinMultiplier(0);

      // Sprawdzenie "Blackjacka" z rozdania
      const pScore = calculateScore(pHand);
      if (pScore === 21) {
        endGame("BLACKJACK! 🎉", 2.5); // 2.5x za klasycznego BlackJacka
      } else {
        setGameState("playing");
      }
    } else if (!isGameActive && gameState !== "betting") {
      // Twardy reset, gdy komponent nadrzędny wymusi koniec
      setGameState("betting");
      setPlayerHand([]);
      setDealerHand([]);
    }
  }, [isGameActive]);

  // Akcja: Dobierz kartę
  const handleHit = () => {
    if (gameState !== "playing") return;
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];

    setDeck(newDeck);
    setPlayerHand(newHand);

    if (calculateScore(newHand) > 21) {
      endGame("BUST! Przegrywasz 💥", 0);
    }
  };

  // Akcja: Zakończ dobieranie (Od razu odpala logikę krupiera)
  const handleStand = () => {
    if (gameState !== "playing") return;

    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];

    // Krupier dobiera do 17
    while (calculateScore(currentDealerHand) < 17) {
      currentDealerHand.push(currentDeck.pop()!);
    }

    setDealerHand(currentDealerHand);
    setDeck(currentDeck);

    // Sprawdzanie wyniku
    const pScore = calculateScore(playerHand);
    const dScore = calculateScore(currentDealerHand);

    if (dScore > 21) {
      endGame("DEALER BUST! Wygrywasz 💸", 2);
    } else if (pScore > dScore) {
      endGame("WYGRYWASZ! 💰", 2);
    } else if (dScore > pScore) {
      endGame("KRUPIER WYGRYWA 🤡", 0);
    } else {
      endGame("REMIS (PUSH) 🤝", 1);
    }
  };

  const resetBoard = () => {
    // Przesyłamy wynik do Mines.tsx/BlackJack.tsx (który doda to do Balance)
    onGameEnd(betAmount * winMultiplier);
    // Po wywołaniu onGameEnd, isGameActive w rodzicu zmieni się na false,
    // co z kolei odpali useEffect czyszczący planszę.
  };

  // Renderowanie pojedynczej karty
  const renderCard = (card: Card, hidden: boolean = false) => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    return (
      <div
        className={`w-20 h-28 md:w-24 md:h-36 rounded-lg border-2 bg-white flex flex-col justify-between p-2 shadow-xl transform transition-transform hover:-translate-y-2
        ${hidden ? "bg-emerald-900 border-emerald-500 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)]" : "border-gray-200"}`}
      >
        {!hidden && (
          <>
            <div
              className={`text-lg md:text-xl font-bold ${isRed ? "text-red-500" : "text-black"}`}
            >
              {card.value}
            </div>
            <div
              className={`text-3xl md:text-5xl text-center ${isRed ? "text-red-500" : "text-black"}`}
            >
              {card.suit}
            </div>
            <div
              className={`text-lg md:text-xl font-bold rotate-180 ${isRed ? "text-red-500" : "text-black"}`}
            >
              {card.value}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-between w-full max-w-[800px] aspect-square lg:aspect-video rounded-3xl p-6 bg-emerald-950/40 border border-emerald-500/20 shadow-[inset_0_0_100px_rgba(16,185,129,0.05)]">
      {/* NAKŁADKA PRZED STARTEM */}
      {gameState === "betting" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-black/50 backdrop-blur-sm">
          <span className="font-pirata text-4xl text-emerald-400 animate-pulse drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
            Place Bet to Play
          </span>
        </div>
      )}

      {/* KRUPIER */}
      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <h2 className="text-emerald-500/50 uppercase tracking-[0.3em] font-bold text-sm">
          Dealer
        </h2>
        <div className="flex gap-2">
          {dealerHand.map((card, idx) => (
            <div key={idx}>
              {renderCard(card, gameState === "playing" && idx === 1)}
            </div>
          ))}
        </div>
        {gameState !== "playing" && gameState !== "betting" && (
          <span className="bg-black/50 px-4 py-1 rounded-full text-emerald-400 font-mono text-sm border border-emerald-500/30">
            Score: {calculateScore(dealerHand)}
          </span>
        )}
      </div>

      {/* ŚRODEK (Wiadomość z wynikiem) */}
      <div className="h-24 flex items-center justify-center w-full z-20 my-4">
        {gameState === "gameOver" && (
          <div className="flex flex-col items-center animate-bounce">
            <span className="font-pirata text-4xl md:text-5xl text-white drop-shadow-[0_0_20px_rgba(16,185,129,1)] bg-black/60 px-8 py-2 rounded-xl border border-emerald-500/50 text-center">
              {message}
              <div className="text-sm font-sans text-emerald-400 tracking-widest uppercase mt-2 opacity-80">
                {winMultiplier > 0
                  ? `+ ${(betAmount * winMultiplier).toFixed(2)}`
                  : "- " + betAmount.toFixed(2)}
              </div>
            </span>
          </div>
        )}
      </div>

      {/* GRACZ */}
      <div className="w-full flex flex-col items-center gap-4 mb-4">
        <div className="flex gap-2 relative">
          {playerHand.map((card, idx) => (
            <div
              key={idx}
              className="relative transition-all"
              style={{ zIndex: idx, marginLeft: idx > 0 ? "-30px" : "0" }}
            >
              {renderCard(card)}
            </div>
          ))}
        </div>

        {gameState !== "betting" && (
          <span className="bg-black/50 px-4 py-1 rounded-full text-emerald-400 font-mono text-sm border border-emerald-500/30">
            Your Score: {calculateScore(playerHand)}
          </span>
        )}

        {/* PRZYCISKI AKCJI GRACZA */}
        {gameState === "playing" ? (
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleHit}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-b-4 border-emerald-800 active:scale-95 transition-transform uppercase tracking-wider cursor-pointer"
            >
              Hit
            </button>
            <button
              onClick={handleStand}
              className="bg-[#1e0b37] hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)] border-b-4 border-[#10061f] active:scale-95 transition-transform uppercase tracking-wider cursor-pointer"
            >
              Stand
            </button>
          </div>
        ) : gameState === "gameOver" ? (
          <button
            onClick={resetBoard}
            className="mt-2 bg-white text-black px-12 py-3 rounded-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:bg-gray-200 border-b-4 border-gray-400 active:scale-95 transition-transform uppercase tracking-wider cursor-pointer"
          >
            Clear Table
          </button>
        ) : (
          <div className="h-[52px]"></div>
        )}
      </div>
    </div>
  );
}

export default BlackJackBoard;
