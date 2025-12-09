import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';

interface ControlsProps {
  app: Application;
  bet: number;
  balance: number;
  onSpin: () => void;
  onChangeBet: (amount: number) => void;
}

const Controls = ({ app, bet, balance, onSpin, onChangeBet }: ControlsProps) => {
  const containerRef = useRef<Container | null>(null);

  // Funkcja pomocnicza do rysowania przycisków
  const createButton = (
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    color: number, 
    textStr: string,
    onClick: () => void,
    isCircle = false
  ) => {
    const btnContainer = new Container();
    btnContainer.x = x;
    btnContainer.y = y;
    
    // Ustawiamy interaktywność
    btnContainer.eventMode = 'static';
    btnContainer.cursor = 'pointer';
    
    // Grafika przycisku
    const bg = new Graphics();
    if (isCircle) {
        bg.circle(0, 0, w); // w tutaj działa jako promień
    } else {
        bg.roundRect(0, 0, w, h, 10);
    }
    bg.fill(color);
    bg.stroke({ width: 4, color: 0x000000 });
    btnContainer.addChild(bg);

    // Tekst na przycisku
    const style = new TextStyle({
        fontFamily: 'Jersey 25', // lub Arial jeśli font się nie ładuje
        fontSize: isCircle ? 36 : 28,
        fontWeight: 'bold',
        fill: '#ffffff',
    });
    const text = new Text({ text: textStr, style });
    text.anchor.set(0.5);
    
    if (isCircle) {
        text.x = 0;
        text.y = 0;
    } else {
        text.x = w / 2;
        text.y = h / 2;
    }
    btnContainer.addChild(text);

    // Obsługa kliknięcia
    btnContainer.on('pointerdown', () => {
        // Prosta animacja kliknięcia (zmniejszenie)
        btnContainer.scale.set(0.95);
        onClick();
    });
    btnContainer.on('pointerup', () => btnContainer.scale.set(1));
    btnContainer.on('pointerupoutside', () => btnContainer.scale.set(1));

    return btnContainer;
  };

  useEffect(() => {
    const PANEL_HEIGHT = 100;
    const controlsContainer = new Container();

    // === TŁO PANELU ===
    const bg = new Graphics();
    bg.rect(0, 0, app.screen.width, PANEL_HEIGHT);
    bg.fill(0x222222); // Ciemny pasek na dole
    bg.stroke({ width: 4, color: 0x000000, alignment: 0 }); // Złota linia na górze paska
    
    // Pozycjonujemy panel na samym dole ekranu
    controlsContainer.y = app.screen.height - PANEL_HEIGHT;
    controlsContainer.addChild(bg);

    // === WYŚWIETLACZ STAWKI (BET) ===
    // Tekst "BET"
    const labelStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 16,
        fill: '#aaaaaa',
    });
    const betLabel = new Text({ text: 'BET', style: labelStyle });
    betLabel.x = 40;
    betLabel.y = 20;
    controlsContainer.addChild(betLabel);

    // Wartość stawki
    const valueStyle = new TextStyle({
        fontFamily: 'Jersey 25',
        fontSize: 32,
        fill: '#ffffff',
        fontWeight: 'bold'
    });
    const betValueText = new Text({ text: `$${bet.toFixed(2)}`, style: valueStyle });
    betValueText.x = 40;
    betValueText.y = 45;
    controlsContainer.addChild(betValueText);

    // === PRZYCISKI ZMIANY STAWKI (- i +) ===
    const btnMinus = createButton(180, 30, 50, 50, 0xAA3333, '-', () => onChangeBet(-1));
    const btnPlus = createButton(250, 30, 50, 50, 0x33AA33, '+', () => onChangeBet(1));
    controlsContainer.addChild(btnMinus);
    controlsContainer.addChild(btnPlus);

    // === PRZYCISK SPIN (Okrągły, po prawej) ===
    const spinBtnRadius = 40; // Promień
    const spinX = app.screen.width - 100;
    const spinY = PANEL_HEIGHT / 2;
    
    const spinBtn = createButton(spinX, spinY, spinBtnRadius, 0, 0xFFD700, 'SPIN', onSpin, true);
    // Nadpiszemy kolor tekstu dla przycisku SPIN na czarny dla kontrastu
    (spinBtn.children[1] as Text).style.fill = '#000000';
    
    controlsContainer.addChild(spinBtn);

    // === BALANCE (Środek) ===
    const balanceLabel = new Text({ text: 'BALANCE', style: labelStyle });
    balanceLabel.anchor.set(0.5, 0);
    balanceLabel.x = app.screen.width / 2;
    balanceLabel.y = 20;
    controlsContainer.addChild(balanceLabel);

    const balanceText = new Text({ text: `$${balance.toFixed(2)}`, style: valueStyle });
    balanceText.anchor.set(0.5, 0);
    balanceText.x = app.screen.width / 2;
    balanceText.y = 45;
    controlsContainer.addChild(balanceText);


    app.stage.addChild(controlsContainer);
    containerRef.current = controlsContainer;

    return () => {
        if (containerRef.current) {
            containerRef.current.destroy({ children: true });
        }
    };
  }, [app, bet, balance]); // Prerysowuj panel, gdy zmieni się stawka lub balans

  return null;
};

export default Controls;