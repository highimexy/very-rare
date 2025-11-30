import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Ticker } from 'pixi.js';

function App() {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initPixi = async () => {
      if (appRef.current) return; 

      const app = new Application();

      await app.init({
        background: '#1099bb',
        resizeTo: window,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (!isMounted) {
        app.destroy({ removeView: true });
        return;
      }

      appRef.current = app;

      if (pixiContainerRef.current) {
        pixiContainerRef.current.appendChild(app.canvas as HTMLCanvasElement);
      }

      // --- LOGIKA GRY ---
      const container = new Container();
      app.stage.addChild(container);

      const rect = new Graphics();
      // Rysowanie prostokąta
      rect.rect(0, 0, 100, 100); 
      rect.fill(0xd5d5d5); 
      
      rect.pivot.set(50, 50);
      container.addChild(rect);

      container.x = app.screen.width / 2;
      container.y = app.screen.height / 2;

      app.ticker.add((ticker: Ticker) => {
        rect.rotation += 0.05 * ticker.deltaTime;
      });
    };

    initPixi();

    return () => {
      isMounted = false;
      if (appRef.current) {
        appRef.current.destroy({ removeView: true });
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={pixiContainerRef} 
      style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} 
    />
  );
}

export default App;