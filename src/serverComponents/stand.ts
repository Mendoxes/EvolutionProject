import express from 'express';
import { calculateHandScore, dealCards } from '../utilities';


export const stand = async (req: express.Request, res: express.Response) =>
{

    const gameState = req.body;
    console.log(gameState)
    const { deck, dealerHand, dealerScore } = gameState;
    if (deck.length === 0)
    {
        res.status(400).json({ message: 'Deck is empty' });
        return;
    }

    if (gameState.dealerScore < 17 && gameState.gameOver === false)
    {
        // dealerHand.push(dealCards(deck, 1));
        gameState.dealerHand.push(deck.pop()!);
        gameState.dealerScore = calculateHandScore(gameState.dealerHand);
        console.log(calculateHandScore(gameState.dealerHand));


    }

    if (gameState.dealerScore > 21)
    {
        gameState.gameOver = true;
        gameState.winner = "player";
    }

    if (gameState.dealerScore === 21)
    {
        gameState.gameOver = true;
        gameState.winner = "dealer";
    }

    if (gameState.dealerScore <= 21 && gameState.dealerScore > gameState.playerScore)
    {
        gameState.gameOver = true;
        gameState.winner = "dealer";
    }

    if (gameState.dealerScore < 21 && gameState.dealerScore >= 17 && gameState.dealerScore < gameState.playerScore)
    {
        gameState.gameOver = true;
        gameState.winner = "player";
    }




    res.json(gameState);

}