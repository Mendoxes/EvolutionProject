export enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
  }
  
  export enum Rank {
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    J,
    Q,
    K,
    A,
  }
  
 export  type Card = {
    rank: Rank;
    suit: Suit;
  };

 export type GameState = {
    playerHand: Card[];
    dealerHand: Card[];
    deck: Card[];
    playerScore: number;
    dealerScore: number;
    gameOver: boolean;
    winner?: "player" | "dealer" | "tie";
  };