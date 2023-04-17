import express from 'express';
import { Card } from '../types';
import { createDeck, shuffleDeck, dealCards, calculateHandScore } from '../utilities';


export const bet = async (req: express.Request, res: express.Response) =>
{
    const tokens = req.body.tokens !== undefined ? req.body.tokens : 1000
    const tokenState = {
        tokens,
        bet: 0
    };

    res.json(tokenState);
};