import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [gameState, setGameState] = useState<
    "betting" | "playing" | "gameOver"
  >("betting");
  const [message, setMessage] = useState<string>("");
  const [winMultiplier, setWinMultiplier] = useState<number>(0);
  const [dealerRevealed, setDealerRevealed] = useState<boolean>(false);

  const generateDeck = () => {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = [
      "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A",
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
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  };

  const endGame = (msg: string, multiplier: number) => {
    setDealerRevealed(true);
    setGameState("gameOver");
    setMessage(msg);
    setWinMultiplier(multiplier);
  };

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
      setDealerRevealed(false);

      const pScore = calculateScore(pHand);
      if (pScore === 21) {
        endGame("BLACKJACK! 🎉", 2.5);
      } else {
        setGameState("playing");
      }
    } else if (!isGameActive && gameState !== "betting") {
      setGameState("betting");
      setPlayerHand([]);
      setDealerHand([]);
      setDealerRevealed(false);
    }
  }, [isGameActive]);

  const handleHit = () => {
    if (gameState !== "playing") return;
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newHand = [...playerHand, newCard];
    setDeck(newDeck);
    setPlayerHand(newHand);
    if (calculateScore(newHand) > 21) {
      endGame("BUST! You lose 💥", 0);
    }
  };

  const handleStand = () => {
    if (gameState !== "playing") return;
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    while (calculateScore(currentDealerHand) < 17) {
      currentDealerHand.push(currentDeck.pop()!);
    }
    setDealerHand(currentDealerHand);
    setDeck(currentDeck);
    const pScore = calculateScore(playerHand);
    const dScore = calculateScore(currentDealerHand);
    if (dScore > 21) {
      endGame("DEALER BUST! You win 💸", 2);
    } else if (pScore > dScore) {
      endGame("YOU WIN! 💰", 2);
    } else if (dScore > pScore) {
      endGame("DEALER WINS 🤡", 0);
    } else {
      endGame("PUSH 🤝", 1);
    }
  };

  const resetBoard = () => {
    onGameEnd(betAmount * winMultiplier);
  };

  const isRed = (card: Card) => card.suit === "♥" || card.suit === "♦";

  const renderCard = (
    card: Card,
    hidden: boolean = false,
    index: number = 0,
    source: "player" | "dealer" = "player"
  ) => {
    const dealDelay = index * 0.15;
    const originX = source === "player" ? "50%" : "50%";
    const originY = source === "player" ? "200%" : "-200%";

    if (hidden) {
      return (
        <motion.div
          key={`hidden-${index}`}
          initial={{ scale: 0, x: 0, y: source === "dealer" ? -120 : 120, rotateY: 90, opacity: 0 }}
          animate={{ scale: 1, x: 0, y: 0, rotateY: 0, opacity: 1 }}
          transition={{ delay: dealDelay, duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
          style={{ originX, originY }}
          className="w-20 h-28 md:w-24 md:h-36 rounded-lg border-2 bg-emerald-900 border-emerald-500 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)] shadow-xl"
        />
      );
    }

    return (
      <motion.div
        key={`${card.suit}-${card.value}-${index}`}
        initial={{ scale: 0, y: source === "dealer" ? -120 : 120, rotateY: 90, opacity: 0 }}
        animate={{ scale: 1, y: 0, rotateY: 0, opacity: 1 }}
        whileHover={{ y: -8, transition: { duration: 0.15 } }}
        transition={{ delay: dealDelay, duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
        className={`w-20 h-28 md:w-24 md:h-36 rounded-lg border-2 bg-white flex flex-col justify-between p-2 shadow-xl border-gray-200 cursor-default`}
      >
        <div className={`text-lg md:text-xl font-bold ${isRed(card) ? "text-red-500" : "text-black"}`}>
          {card.value}
        </div>
        <div className={`text-3xl md:text-5xl text-center ${isRed(card) ? "text-red-500" : "text-black"}`}>
          {card.suit}
        </div>
        <div className={`text-lg md:text-xl font-bold rotate-180 ${isRed(card) ? "text-red-500" : "text-black"}`}>
          {card.value}
        </div>
      </motion.div>
    );
  };

  const messageColor =
    winMultiplier > 1
      ? "text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,1)]"
      : winMultiplier === 1
      ? "text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,1)]"
      : "text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,1)]";

  return (
    <div className="relative flex flex-col items-center justify-between w-full max-w-[800px] aspect-square lg:aspect-video rounded-3xl p-6 bg-emerald-950/40 border border-emerald-500/20 shadow-[inset_0_0_100px_rgba(16,185,129,0.05)]">
      {/* BETTING OVERLAY */}
      <AnimatePresence>
        {gameState === "betting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-black/50 backdrop-blur-sm"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="font-pirata text-4xl text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
            >
              Place Bet to Play
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEALER */}
      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <h2 className="text-emerald-500/50 uppercase tracking-[0.3em] font-bold text-sm">
          Dealer
        </h2>
        <div className="flex gap-2">
          <AnimatePresence>
            {dealerHand.map((card, idx) =>
              gameState === "playing" && idx === 1 ? (
                <div key={`dealer-hidden-${idx}`}>
                  {renderCard(card, true, idx, "dealer")}
                </div>
              ) : (
                <motion.div
                  key={`dealer-${card.suit}-${card.value}-${idx}`}
                  layout
                >
                  {renderCard(card, false, idx, "dealer")}
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {gameState !== "playing" && gameState !== "betting" && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 px-4 py-1 rounded-full text-emerald-400 font-mono text-sm border border-emerald-500/30"
            >
              Score: {calculateScore(dealerHand)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* RESULT MESSAGE */}
      <div className="h-24 flex items-center justify-center w-full z-20 my-4">
        <AnimatePresence>
          {gameState === "gameOver" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex flex-col items-center"
            >
              <span
                className={`font-pirata text-4xl md:text-5xl bg-black/60 px-8 py-2 rounded-xl border border-emerald-500/50 text-center ${messageColor}`}
              >
                {message}
                <div className="text-sm font-sans tracking-widest uppercase mt-2 opacity-80">
                  {winMultiplier > 0
                    ? `+ ${(betAmount * winMultiplier).toFixed(2)}`
                    : "- " + betAmount.toFixed(2)}
                </div>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PLAYER */}
      <div className="w-full flex flex-col items-center gap-4 mb-4">
        <div className="flex gap-2 relative">
          <AnimatePresence>
            {playerHand.map((card, idx) => (
              <motion.div
                key={`player-${card.suit}-${card.value}-${idx}`}
                layout
                style={{ zIndex: idx, marginLeft: idx > 0 ? "-30px" : "0" }}
              >
                {renderCard(card, false, idx, "player")}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {gameState !== "betting" && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/50 px-4 py-1 rounded-full text-emerald-400 font-mono text-sm border border-emerald-500/30"
            >
              Your Score: {calculateScore(playerHand)}
            </motion.span>
          )}
        </AnimatePresence>

        {/* ACTION BUTTONS */}
        {gameState === "playing" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 mt-2"
          >
            <motion.button
              onClick={handleHit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-b-4 border-emerald-800 uppercase tracking-wider cursor-pointer transition-colors"
            >
              Hit
            </motion.button>
            <motion.button
              onClick={handleStand}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1e0b37] hover:bg-purple-900 text-white px-8 py-3 rounded-lg font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)] border-b-4 border-[#10061f] uppercase tracking-wider cursor-pointer transition-colors"
            >
              Stand
            </motion.button>
          </motion.div>
        ) : gameState === "gameOver" ? (
          <motion.button
            onClick={resetBoard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 bg-white text-black px-12 py-3 rounded-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:bg-gray-200 border-b-4 border-gray-400 uppercase tracking-wider cursor-pointer transition-colors"
          >
            Clear Table
          </motion.button>
        ) : (
          <div className="h-[52px]" />
        )}
      </div>
    </div>
  );
}

export default BlackJackBoard;
