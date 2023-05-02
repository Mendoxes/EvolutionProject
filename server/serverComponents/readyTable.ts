
import { bodyInterface, Card, responseJsonInterface } from '../types';

let deck: Card[] = [];

export const readyTable = async (req: bodyInterface, res: responseJsonInterface) =>
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



    res.json(gameState);
};