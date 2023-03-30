import express from 'express';
import { Card } from '../types';
import { createDeck, shuffleDeck, dealCards, calculateHandScore } from '../utilities';

let deck: Card[] = [];


export const createGame = async (req: express.Request, res: express.Response) =>
{


  if (deck.length < 10)
  {
    deck = createDeck();
    shuffleDeck(deck);
  }

  const playerHand = dealCards(deck, 2);
  const dealerHand = dealCards(deck, 1);
  //timeout for second card? or get 2 cards at once and then display them one by one?
  const tokens = req.body.tokens !== undefined ? req.body.tokens : 1000
  const gameState = {
    playerHand,
    dealerHand,
    deck,
    playerScore: calculateHandScore(playerHand),
    dealerScore: calculateHandScore(dealerHand),
    gameOver: false,
    tokens
  };



  res.json(gameState);
};