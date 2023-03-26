import { action, computed, makeAutoObservable, observable } from "mobx";
import { createContext } from "react";
// import { useContext } from "react";
// import { observer } from "mobx-react-lite";
import axios from "axios";
import { GameState } from '../types';
const URL_BASE = 'http://localhost:5000/api';

export class GameStore
{

  private _gameState: GameState | null = null;

  constructor()
  {
    makeAutoObservable(this, {
      gameState: computed,
      setGameState: action,
      createNewGame: action,
    });
  }

  get gameState(): GameState | null
  {
    return this._gameState;
  }

  setGameState: (gameState: GameState | null) => unknown = (gameState: GameState | null) =>
  {
    this._gameState = gameState;
  }


  async createNewGame(): Promise<void>
  {
    try
    {
      const response = await axios.post(`${URL_BASE}/game`);
      const gameState: GameState = response.data;
      console.log('Game state:', gameState);
      this.setGameState(gameState)
    } catch (error)
    {
      console.error('Error creating new game:', error);
    }
  }

  async hit(): Promise<void>
  {
    try
    {

      const response = await axios.post(`${URL_BASE}/hit`, this.gameState);
      const gameState: GameState = response.data;
      console.log('Game state:', gameState);
      this.setGameState(gameState)
    } catch (error)
    {
      console.error('Error creating new game:', error);

    }
  }

  async stand(): Promise<void>
  {
    try
    {
      const response = await axios.post(`${URL_BASE}/stand`, this.gameState);
      const gameState: GameState = response.data;
      console.log('Game state:', gameState);
      this.setGameState(gameState);
    } catch (error)
    {
      console.error('Error standing:', error);
    }
  }

}




const counterStore = new GameStore();
const CounterContext: React.Context<GameStore> = createContext(counterStore);
export default CounterContext;