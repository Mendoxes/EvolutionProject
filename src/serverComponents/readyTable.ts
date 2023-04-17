import express from 'express';
import { Card } from '../types';
import { createDeck, shuffleDeck, dealCards, calculateHandScore } from '../utilities';
let deck: Card[] = [];

export const readyTable = async (req: express.Request, res: express.Response) =>
{

    const tokens = req.body.tokens !== undefined ? req.body.tokens : 1000
    const gameState = {
        playerHand: 0,
        dealerHand: 0,
        deck,
        playerScore: 0,
        dealerScore: 0,
        gameOver: false,
        hands: [],
        tokens
    };

    // console.log(gameState)

    res.json(gameState);
};