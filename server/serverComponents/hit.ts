

import { bodyInterface, responseJsonInterface } from '../types';
import { calculateHandScore } from '../utilities';


export const hit = async (req: bodyInterface, res: responseJsonInterface) =>
{
  const gameState = req.body._gameState;
  const { deck, playerHands } = gameState;
  const { hands } = req.body._gameState;


  console.log(req.body)
  for (let handIndex = 0; handIndex < playerHands.length; handIndex++)
  {

    const hand = playerHands[handIndex];
    if (hand && gameState.playerScores[handIndex] < 21 && !gameState.gameOver)
    {

      for (let i = 0; i < req.body._limit.length; i++)
      {

        if (hands[handIndex] === req.body._limit[i])
        {
          hand.push(deck.pop()!);
        }
        gameState.playerScores[handIndex] = calculateHandScore(hand);
      }
    }
  }


  const updatedGameState = {
    ...gameState,
    playerHands,
    limit: []
  };

  res.json(updatedGameState);
};


