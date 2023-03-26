
import express from 'express';
import { calculateHandScore } from '../utilities';
export const hit = async (req: express.Request, res: express.Response) =>
{
  const gameState = req.body;
  const { deck, playerHand } = gameState;

  if (deck.length === 0)
  {
    res.status(400).json({ message: 'Deck is empty' });
    return;
  }




  if (gameState.playerScore < 21 && gameState.gameOver === false)
  {
    playerHand.push(deck.pop()!);
    gameState.playerScore = calculateHandScore(gameState.playerHand);

    if (gameState.playerScore > 21)
    {

      gameState.gameOver = true;
      gameState.winner = "dealer";
    }
  }

  const updatedGameState = {
    ...gameState,
    playerHand,
    playerScore: calculateHandScore(playerHand),

  };

  res.json(updatedGameState);
};