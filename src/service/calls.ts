import axios from 'axios';
import { GameState } from '../types';
const URL_BASE = 'http://localhost:8088/api';

export const createNewGame = async () =>
{
  try
  {
    const response = await axios.post(`${URL_BASE}/game`);
    const gameState: GameState = response.data;
    console.log('Game state:', gameState);
    // Handle the game state object here
  } catch (error)
  {
    console.error('Error creating new game:', error);
  }
};


  //maybe i should use api calls  in here not in mobX store