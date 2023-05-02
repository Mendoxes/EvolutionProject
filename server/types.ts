import express from "express";

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
  playerHands: any;
  dealerHand: Card[];
  deck: Card[];
  playerScore: number;
  dealerScore: number;
  gameOver: boolean;
  tokens: number;
  playerScores?: number[];
  hands?: number[];
  // winner?: "player" | "dealer" | "tie";
  winner?: number[] | string[];
  bet?: number;
  limit?: number;
};


export interface bodyInterface extends express.Request
{
  body: any,

}

export interface responseJsonInterface extends express.Response
{
  json: any
  status: any

}