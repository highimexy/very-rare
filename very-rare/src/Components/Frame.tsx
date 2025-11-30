import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';

interface FrameProps {
  app: Application;
}

const Frame = ({ app }: FrameProps) => {
  // Ref trzymający kontener maszyny, żebyśmy mogli go usunąć przy odświeżaniu
  const containerRef = useRef<Container | null>(null);

  useEffect(() => {
    // === KONFIGURACJA SLOTU ===
    const COLS = 6;           // Ilość kolumn (jak w Le Bandit)
    const ROWS = 5;           // Ilość rzędów
    const CELL_SIZE = 80;     // Rozmiar jednej kratki w px (dostosuj do swojego pixel artu)
    const GAP = 10;           // Odstęp między kratkami
    const BORDER_SIZE = 20;   // Margines ramki
    
    // Obliczamy całkowitą szerokość i wysokość siatki
    const gridWidth = (COLS * CELL_SIZE) + ((COLS - 1) * GAP);
    const gridHeight = (ROWS * CELL_SIZE) + ((ROWS - 1) * GAP);
    const totalMachineWidth = gridWidth + (BORDER_SIZE * 2);
    const totalMachineHeight = gridHeight + (BORDER_SIZE * 2) + 50; // +50 na nagłówek

    // Tworzymy główny kontener (Grupę) dla całej maszyny
    const machineContainer = new Container();
    
    // === RYSOWANIE TŁA MASZYNY (RAMKI) ===
    const frameBg = new Graphics();
    frameBg.rect(0, 0, totalMachineWidth, totalMachineHeight);
    frameBg.fill(0x4a4a4a); // Ciemnoszary kolor (zamiast Twojej grafiki ramki)
    frameBg.stroke({ width: 4, color: 0x000000 }); // obwódka
    machineContainer.addChild(frameBg);

    // === RYSOWANIE SIATKI (GRIDU) ===
    // Kontener na same kratki
    const gridContainer = new Container();
    gridContainer.x = BORDER_SIZE;
    gridContainer.y = BORDER_SIZE + 50; // Przesuwamy w dół, żeby zrobić miejsce na nagłówek
    machineContainer.addChild(gridContainer);

    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS; row++) {
        // Rysujemy pojedynczą komórkę (później tu będzie Twój Sprite)
        const cell = new Graphics();
        
        // Rysujemy ciemny kwadrat (tło pod symbol)
        cell.rect(0, 0, CELL_SIZE, CELL_SIZE);
        cell.fill({ color: 0x000000, alpha: 0.5 }); // Półprzezroczysty czarny

        // Ustawiamy pozycję
        cell.x = col * (CELL_SIZE + GAP);
        cell.y = row * (CELL_SIZE + GAP);

        gridContainer.addChild(cell);
      }
    }

    // === NAGŁÓWEK (OPCJONALNIE) ===
    const style = new TextStyle({
      fontFamily: 'Jersey 25', 
      fontSize: 42,
      fill: '#ffffff',
      fontWeight: 'bold',
      letterSpacing: 5,
    });
    
    const title = new Text({ text: 'VERY RARE', style });
    title.x = totalMachineWidth / 2 - title.width / 2;
    title.y = 15;
    machineContainer.addChild(title);


    // === POZYCJONOWANIE NA EKRANIE ===
    // Ustawiamy maszynę idealnie na środku ekranu
    machineContainer.x = (app.screen.width - totalMachineWidth) / 2;
    machineContainer.y = (app.screen.height - totalMachineHeight) / 2;

    // Dodajemy maszynę do sceny
    app.stage.addChild(machineContainer);
    containerRef.current = machineContainer;

    // Cleanup przy odmontowaniu
    return () => {
      if (containerRef.current) {
        containerRef.current.destroy({ children: true });
      }
    };
  }, [app]); // Uruchom ponownie, jeśli zmieni się instancja app (lub przy resize, jeśli dodasz listener)

  return null; // Ten komponent nic nie renderuje w HTML, operuje tylko na Canvasie Pixi
};

export default Frame;