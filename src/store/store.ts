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
  private _tokensChangeOnWinOrLoss = 0;

  constructor()
  {
    makeAutoObservable(this, {
      gameState: computed,
      setGameState: action,
      createNewGame: action,
      setTokensChangeOnWinOrLoss: action,
      tokensChangeOnWinOrLoss: computed,
    });
  }

  get tokensChangeOnWinOrLoss(): number
  {
    return this._tokensChangeOnWinOrLoss;
  }

  setTokensChangeOnWinOrLoss: (tokens: number) => unknown = (tokens: number) =>
  {
    this._tokensChangeOnWinOrLoss = tokens;
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
    // if (this.gameState !== null && this.gameState.gameOver === true)
    // {
    //   this.gameState!.dealerHand = [];
    //   this.gameState!.playerHand = [];
    // }

    try
    {
      const response = await axios.post(`${URL_BASE}/game`, this.gameState);
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

      if (gameState.gameOver && gameState.winner === 'dealer')
      {
        // gameState.dealerHand.length = 0;
        // gameState.playerHand.length = 0;
        gameState.tokens = gameState.tokens - this.tokensChangeOnWinOrLoss;
        this.setTokensChangeOnWinOrLoss(0)

      } else if (gameState.gameOver && gameState.winner === 'player')
      {
        // gameState.dealerHand.length = 0;
        // gameState.playerHand.length = 0;
        gameState.tokens = gameState.tokens + this.tokensChangeOnWinOrLoss;
        this.setTokensChangeOnWinOrLoss(0)
      }
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

      if (gameState.gameOver && gameState.winner === 'dealer')
      {

        gameState.tokens = gameState.tokens - this.tokensChangeOnWinOrLoss;
        this.setTokensChangeOnWinOrLoss(0)

      } else if (gameState.gameOver && gameState.winner === 'player')
      {

        gameState.tokens = gameState.tokens + this.tokensChangeOnWinOrLoss;
        this.setTokensChangeOnWinOrLoss(0)
      }
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