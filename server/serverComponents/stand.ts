
import { bodyInterface, responseJsonInterface } from '../types';
import { calculateHandScore } from '../utilities';

export const stand = async (req: bodyInterface, res: responseJsonInterface) =>
{
    const gameState = req.body;
    const { deck } = gameState;
    if (deck.length === 0)
    {
        res.status(400).json({ message: 'Deck is empty' });
        return;
    }


    while (gameState.dealerScore < 17 && !gameState.gameOver)
    {
        gameState.dealerHand.push(deck.pop()!);
        gameState.dealerScore = calculateHandScore(gameState.dealerHand);
    }

    const winners: number[] = [];
    for (let handIndex = 0; handIndex < gameState.hands.length; handIndex++)
    {

        const handScore = gameState.playerScores[handIndex];

        if (handScore <= 21 && (handScore > gameState.dealerScore || gameState.dealerScore > 21))
        {

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

        gameState.winner = winners
    }
    else
    {
        gameState.winner = winners

    }



    res.json(gameState);
}