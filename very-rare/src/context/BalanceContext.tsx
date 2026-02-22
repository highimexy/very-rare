import { createContext, useContext, useState, type ReactNode } from "react";

interface BalanceContextType {
  balance: number;
  addWin: (amount: number) => void;
  subtractBet: (amount: number) => boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  // Stan balansu dostępny w całej aplikacji
  const [balance, setBalance] = useState<number>(5000.0);

  const addWin = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  const subtractBet = (amount: number) => {
    if (amount > balance) return false;
    setBalance((prev) => prev - amount);
    return true;
  };

  return (
    <BalanceContext.Provider value={{ balance, addWin, subtractBet }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context)
    throw new Error("useBalance must be used within BalanceProvider");
  return context;
};
