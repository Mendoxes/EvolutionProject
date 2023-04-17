// import express from 'express';
// import { calculateHandScore } from '../utilities';


// export const hit = async (req: express.Request, res: express.Response) =>
// {
//   const gameState = req.body;
//   const { deck, playerHands, limit } = gameState;
//   const { hands } = req.body;
//   // console.log("hands:", hands)

//   // Loop over the hands to add cards to each hand
//   // const limit2 = req.body._limit;
//   // console.log(limit2, "limit2")
//   // console.log(limit, "limit")
//   for (let handIndex = 0; handIndex < playerHands.length; handIndex++)
//   {

//     const hand = playerHands[handIndex];
//     if (hand && gameState.playerScores[handIndex] < 21 && !gameState.gameOver)
//     {

//       console.log("hand:", hand)
//       console.log(hands[handIndex])
//       if (hands[handIndex] === limit)
//       {
//         hand.push(deck.pop()!);
//       }
//       gameState.playerScores[handIndex] = calculateHandScore(hand);
//       // console.log(`Hand ${handIndex}:`, hand);
//     }
//   }

//   const updatedGameState = {
//     ...gameState,
//     playerHands,
//     limit: []
//   };

//   // console.log(updatedGameState);
//   res.json(updatedGameState);
// };




import express from 'express';
import { calculateHandScore } from '../utilities';


export const hit = async (req: express.Request, res: express.Response) =>
{
  const gameState = req.body._gameState;
  const { deck, playerHands, limit } = gameState;
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
    // limit: []
  };

  res.json(updatedGameState);
};


