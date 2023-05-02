
import { bodyInterface, responseJsonInterface } from '../types';



export const chooseHands = async (req: bodyInterface, res: responseJsonInterface) =>
{
    const gameState = req.body.gameState;
    const numHands = gameState.playerHands.length;

    for (let i = 0; i < numHands; i++)
    {
        if (gameState.playerHands[i].chosen)
        {
            gameState.playerHands[i].chosen = true;
        }
    }

    gameState.gameOver = false;
    gameState.dealerHand = [];
    gameState.dealerScore = 0;


    res.json(gameState);
};



