
import { bodyInterface, responseJsonInterface } from '../types';



export const bet = async (req: bodyInterface, res: responseJsonInterface) =>
{
    const tokens = req.body.tokens !== undefined ? req.body.tokens : 1000
    const tokenState = {
        tokens,
        bet: 0
    };

    res.json(tokenState);
};