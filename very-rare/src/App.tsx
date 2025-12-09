import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import Frame from './Components/Frame';
import Controls from './Components/Controls';

// === KONFIGURACJA GRY ===
// Tutaj możesz łatwo zmieniać ustawienia początkowe i limity
const GAME_CONFIG = {
  INITIAL_BALANCE: 5000.00, // Saldo początkowe
  INITIAL_BET: 2.00,        // Stawka początkowa
  BET_STEP: 1.00,           // O ile zmienia się stawka po kliknięciu +/- (np. 1.00)
  MIN_BET: 0.20,            // Minimalna stawka
  MAX_BET: 100.00           // Maksymalna stawka
};

function App() {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<Application | null>(null);
  // Zabezpieczenie przed podwójną inicjalizacją w React Strict Mode (development)
  const initializedRef = useRef(false);

  // === STAN GRY ===
  const [balance, setBalance] = useState(GAME_CONFIG.INITIAL_BALANCE);
  const [bet, setBet] = useState(GAME_CONFIG.INITIAL_BET);

  // === LOGIKA GRY ===
  const handleSpin = () => {
    if (balance >= bet) {
      setBalance(prev => prev - bet);
      console.log(`SPIN! Stawka: ${bet}, Nowe saldo: ${balance - bet}`);
      // Tutaj w przyszłości dodamy wywołanie funkcji startującej bębny
    } else {
      console.log("Brak środków!");
      // Możesz tu dodać prosty alert lub modal w przyszłości
      alert("Niewystarczające środki!");
    }
  };

  const handleChangeBet = (direction: number) => {
    setBet(prev => {
      // Obliczamy nową stawkę używając zdefiniowanego kroku (BET_STEP)
      const newBet = prev + (direction * GAME_CONFIG.BET_STEP);
      
      // Zabezpieczamy przed wyjściem poza zakres MIN i MAX
      if (newBet < GAME_CONFIG.MIN_BET) return GAME_CONFIG.MIN_BET;
      if (newBet > GAME_CONFIG.MAX_BET) return GAME_CONFIG.MAX_BET;
      
      return newBet;
    });
  };

  useEffect(() => {
    // Zapobiegamy podwójnemu uruchomieniu Pixi w trybie deweloperskim
    if (initializedRef.current) return;
    initializedRef.current = true;

    const pixiApp = new Application();

    const initPixi = async () => {
      await pixiApp.init({
        background: '#2c3e50', // Ciemne tło canvasa
        resizeTo: window,      // Automatyczne dopasowanie do okna
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1, // Ostrość na ekranach Retina
        autoDensity: true,
        roundPixels: true,     // Ważne dla Pixel Artu - zapobiega rozmyciu
      });

      // Sprawdzamy, czy kontener w drzewie DOM nadal istnieje
      if (pixiContainerRef.current) {
        pixiContainerRef.current.appendChild(pixiApp.canvas as HTMLCanvasElement);
        setApp(pixiApp); // Zapisujemy instancję Pixi, by przekazać ją do komponentów
      } else {
        // Jeśli kontener zniknął (np. szybka nawigacja), czyścimy
        pixiApp.destroy({ removeView: true });
      }
    };

    initPixi();

    // Funkcja czyszcząca (Cleanup)
    return () => {
      if (pixiApp.renderer) {
        pixiApp.destroy({ removeView: true, texture: true, baseTexture: true });
        initializedRef.current = false;
      }
    };
  }, []);

  return (
    <div 
      ref={pixiContainerRef} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        display: 'flex',       
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000' // Czarne tło strony pod canvasem
      }} 
    >
      {/* Renderujemy komponenty Pixi tylko gdy aplikacja jest gotowa */}
      {app && (
        <>
            {/* Warstwa 1: Ramka i siatka slotu */}
            <Frame app={app} />
            
            {/* Warstwa 2: Panel sterowania na dole */}
            <Controls 
                app={app} 
                bet={bet} 
                balance={balance} 
                onSpin={handleSpin} 
                onChangeBet={handleChangeBet}
            />
        </>
      )}
    </div>
  );
}

export default App;