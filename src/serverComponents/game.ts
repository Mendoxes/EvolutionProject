import express from 'express';
import { Card } from '../types';
import { createDeck, shuffleDeck, dealCards, calculateHandScore } from '../utilities';

let deck: Card[] = [];



export const createGame = async (req: express.Request, res: express.Response) =>
{


  console.log(req.body)
  const numHands = req.body._playerHands?.length;

  console.log("playerHands", numHands)

  deck = req.body._gameState.deck !== undefined ? req.body._gameState.deck : createDeck();

  if (deck.length < 10)
  {
    deck = createDeck();
    shuffleDeck(deck);
  }

  const playerHands = [];
  const playerScores = [];

  for (let i = 0; i < numHands; i++)
  {
    playerHands.push(dealCards(deck, 1));
    playerScores.push(calculateHandScore(playerHands[i]));
  }

  const dealerHand = dealCards(deck, 1);
  const tokens = req.body._gameState.tokens !== undefined ? req.body._gameState.tokens : 1000;

  const gameState = {
    playerHands,
    dealerHand,
    deck,
    playerScores,
    dealerScore: calculateHandScore(dealerHand),
    gameOver: false,
    hands: req.body._playerHands,
    tokens,
    limit: 1
  };


  res.json(gameState);
};
