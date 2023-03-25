import express from 'express';
import { createDeck, shuffleDeck, dealCards, calculateHandScore } from '../utilities';

export const createGame = async (req: express.Request, res: express.Response) => {
  const deck = createDeck();
  shuffleDeck(deck);
console.log(deck)
  const playerHand = dealCards(deck, 1);
  const dealerHand = dealCards(deck, 1);
  //timeout for second card? or get 2 cards at once and then display them one by one?

  const gameState = {
    playerHand,
    dealerHand,
    deck,
    playerScore: calculateHandScore(playerHand),
    dealerScore: calculateHandScore(dealerHand),
    gameOver: false,
  };



  res.json(gameState);
};