import express from 'express';
import { bet } from './bet';
import { createGame } from './game';
import { hit } from './hit';
import { readyTable } from './readyTable';
import { stand } from './stand';

export const apiRouter = express.Router();

apiRouter.post('/game', createGame);
apiRouter.post('/table', readyTable);
apiRouter.post('/bet', bet);
apiRouter.post('/hit', hit);
apiRouter.post('/stand', stand);
//get routes for hit and stand