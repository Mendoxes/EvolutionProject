import express from 'express';
import { createGame} from './game';
import { hit } from './hit';
import { stand } from './stand';

export const apiRouter = express.Router();

apiRouter.post('/game', createGame);
apiRouter.post('/hit', hit);
apiRouter.post('/stand', stand);
//get routes for hit and stand