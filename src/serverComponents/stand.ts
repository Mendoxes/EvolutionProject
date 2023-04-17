
import express from 'express';
import { calculateHandScore, dealCards } from '../utilities';

export const stand = async (req: express.Request, res: express.Response) =>
{
    const gameState = req.body;
    const { deck } = gameState;
    if (deck.length === 0)
    {
        res.status(400).json({ message: 'Deck is empty' });
        return;
    }

    // Update the dealer's hand and score
    while (gameState.dealerScore < 17 && !gameState.gameOver)
    {
        gameState.dealerHand.push(deck.pop()!);
        gameState.dealerScore = calculateHandScore(gameState.dealerHand);
    }

    const winners = [];
    for (let handIndex = 0; handIndex < gameState.hands.length; handIndex++)

    // for (const handIndex of gameState.hands)
    {
        console.log(winners)
        const handScore = gameState.playerScores[handIndex];
        console.log(handScore)
        console.log(gameState.dealerScore)
        if (handScore <= 21 && (handScore > gameState.dealerScore || gameState.dealerScore > 21))
        {
            console.log(handScore)
            console.log(gameState.dealerScore)
            winners.push(handIndex);
        }
    }

    gameState.gameOver = true;
    if (winners.length === 0)   
    {
        gameState.winner = ["dealer"];
    }
    else if (winners.length === 1)
    {
        // gameState.winner = `Player ${winners[0] + 1}`;
        gameState.winner = winners
    }
    else
    {
        gameState.winner = winners
        // gameState.winner = `Players ${winners.map(index => index + 1).join(", ")}`;
    }

    // console.log(gameState)

    res.json(gameState);
}