export const SLOT_CONFIG = {
  COLS: 6,
  ROWS: 5,
  CELL_SIZE: 80,
  GAP: 10,
  // Całkowita widoczna wysokość jednego bębna (5 rzędów + 4 przerwy)
  REEL_HEIGHT_VISUAL: (5 * 80) + (4 * 10), 
};

// Definicja symboli. Używamy nazw, które będą odpowiadały Twoim plikom PNG/SpriteSheet.
// Pamiętaj: w Pixel Art, im rzadszy symbol, tym lepiej wygląda!
export const SYMBOLS = [
  { id: 'S1_LOW_J', color: 0xAAAAAA, isWild: false, asset: 'assets/symbols/low_J.png' }, // Niskie J
  { id: 'S2_LOW_Q', color: 0x9999FF, isWild: false, asset: 'assets/symbols/low_Q.png' }, // Niskie Q
  { id: 'S3_LOW_K', color: 0x8888EE, isWild: false, asset: 'assets/symbols/low_K.png' }, // Niskie K
  { id: 'S4_LOW_A', color: 0x7777DD, isWild: false, asset: 'assets/symbols/low_A.png' }, // Niskie A
  
  { id: 'S5_MID_Bag', color: 0xFFA07A, isWild: false, asset: 'assets/symbols/mid_Bag.png' }, // Średnie (np. worek z łupem)
  { id: 'S6_MID_Beer', color: 0xFFD700, isWild: false, asset: 'assets/symbols/mid_Beer.png' }, // Średnie (np. piwo, jak w Le Bandit)
  
  { id: 'S7_HIGH_Gold', color: 0xFF4500, isWild: false, asset: 'assets/symbols/high_Gold.png' }, // Wysokie (np. Sztabka Złota)
  { id: 'S8_WILD', color: 0x00FF00, isWild: true, asset: 'assets/symbols/WILD.png' }, // Najwyższe (WILD)
];

// Funkcja pomocnicza do losowania symbolu (na razie losuje tylko wizualnie)
export const getRandomSymbol = () => {
    const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
    return SYMBOLS[randomIndex];
}