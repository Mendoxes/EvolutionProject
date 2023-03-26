export enum Suit
{
  Clubs,
  Diamonds,
  Hearts,
  Spades,
  Back
}

export enum SuitValue
{
  C = 0,
  D = 1,
  H = 2,
  S = 3,
}

export enum Rank
{
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
  B
}

export type Card = {
  rank: Rank;
  suit: Suit;
  isDealer?: boolean;
  index?: number;
};

export type SinglePageCard = Card & {
  isDealer: boolean;
  index: number;
}

export type GameState = {
  playerHand: Card[];
  dealerHand: Card[];
  deck: Card[];
  playerScore: number;
  dealerScore: number;
  gameOver: boolean;
  winner?: "player" | "dealer" | "tie";
};