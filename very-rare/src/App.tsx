import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import Frame from './Components/Frame'; // Importujemy Twój komponent

function App() {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState<Application | null>(null);
  // Zabezpieczenie przed podwójnym odpaleniem w React Strict Mode
  const initializedRef = useRef(false);

  useEffect(() => {
    // Jeśli już zainicjowaliśmy, nie rób tego ponownie
    if (initializedRef.current) return;
    initializedRef.current = true;

    const pixiApp = new Application();

    const initPixi = async () => {
      await pixiApp.init({
        background: '#2c3e50', // Tymczasowy kolor tła (zamiast grafiki)
        resizeTo: window,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        // WAŻNE DLA PIXEL ART:
        roundPixels: true, 
      });

      // Sprawdź czy kontener w HTML nadal istnieje (czy nie wyszliśmy ze strony)
      if (pixiContainerRef.current) {
        pixiContainerRef.current.appendChild(pixiApp.canvas as HTMLCanvasElement);
        setApp(pixiApp); // Zapisujemy instancję, by przekazać ją dalej
      } else {
        // Jeśli kontener zniknął, niszczymy aplikację, żeby nie wisiała w pamięci
        pixiApp.destroy({ removeView: true });
      }
    };

    initPixi();

    return () => {
      // Cleanup
      // Sprawdzamy czy renderer żyje, aby uniknąć błędów przy szybkim odmontowaniu
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
        // Dodatkowe style dla lepszego wyglądu podczas ładowania
        display: 'flex',       
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000' 
      }} 
    >
      {/* Renderujemy Frame tylko gdy Pixi jest gotowe */}
      {app && <Frame app={app} />}
    </div>
  );
}

export default App;