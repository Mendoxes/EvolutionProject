import express from 'express';
import { createGame} from './game';

export const apiRouter = express.Router();

apiRouter.post('/game', createGame);
//get routes for hit and stand