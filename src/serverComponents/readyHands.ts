

import express from 'express';
import { Card } from '../types';
import { createDeck, shuffleDeck, dealCards, calculateHandScore } from '../utilities';
let deck: Card[] = [];


export const chooseHands = async (req: express.Request, res: express.Response) =>
{
    const gameState = req.body.gameState;
    const numHands = gameState.playerHands.length;

    // Loop through each hand and mark as chosen if it was selected by the player
    for (let i = 0; i < numHands; i++)
    {
        if (gameState.playerHands[i].chosen)
        {
            gameState.playerHands[i].chosen = true;
        }
    }

    // Update the gameState object with the chosen hands
    gameState.gameOver = false;
    gameState.dealerHand = [];
    gameState.dealerScore = 0;

    // console.log(gameState);
    res.json(gameState);
};



