

import { action, computed, makeAutoObservable, observable, toJS } from "mobx";
import { createContext } from "react";
import axios from "axios";
import { GameState } from '../types';
// const URL_BASE = 'http://localhost:8088/api';
const URL_BASE = 'https://servertesttsc.herokuapp.com/api';



export class GameStore
{

  private _gameState: GameState | null = null;
  private _tokensChangeOnWinOrLoss = 0;
  private _tokentsFromHand = [0, 0, 0]
  public _prevTokentsFromHand = [0, 0, 0]
  private _bank = 0;
  public _playerHands: number[] = [];
  public _limit: number[] = [];
  public _playerStand: number[] = [];

  constructor()
  {
    makeAutoObservable(this, {
      gameState: computed,
      setGameState: action,
      createNewGame: action,
      setTokensChangeOnWinOrLoss: action,
      tokensChangeOnWinOrLoss: computed,
      setTokensFromHand: action,
      setLimit: action,

      tokentsFromHand: computed,
      setPlayerHands: action,
      playerHands: computed
      // bank: computed
    });
  }



  setLimit: (limit: number) => unknown = (limit: number) =>
  {
    if (!this._limit.includes(limit))
    {
      this._limit.push(limit)
    }
  }

  // setPlayerStand: (limit: number) => unknown = (limit: number) =>
  // {
  //   this._limit.push(limit);
  // }

  setTokensFromHand: (tokens: number, x: number) => unknown = (tokens: number, x: number) =>
  {


    this._tokentsFromHand[x] += tokens;


  }


  setPlayerNumber: (playerNumber: number[]) => unknown = (playerNumber: number[]) =>
  {
    this._playerHands = playerNumber;
  }

  get tokentsFromHand(): number[]
  {
    return this._tokentsFromHand;
  }


  setPlayerHands: (playerHand: number) => unknown = (playerHand: number) =>
  {
    if (!this.playerHands.includes(playerHand))
    {

      this.playerHands.push(playerHand);


      this.playerHands.sort(function (a, b)
      {
        return a - b;
      });
    }
  }


  get playerHands(): number[]
  {
    return this._playerHands
  }



  get tokensChangeOnWinOrLoss(): number
  {
    return this._tokensChangeOnWinOrLoss;
  }

  setTokensChangeOnWinOrLoss: (tokens: number) => unknown = (tokens: number) =>
  {


    this._tokensChangeOnWinOrLoss += tokens;

  }

  get gameState(): GameState | null
  {
    return this._gameState;
  }

  setGameState: (gameState: GameState | null) => unknown = (gameState: GameState | null) =>
  {
    this._gameState = gameState;
  }

  async setTable(): Promise<void>
  {
    try
    {
      const response = await axios.post(`${URL_BASE}/table`, this.gameState);
      const gameState: GameState = response.data;
      console.log('Game state:', gameState);
      this.setGameState(gameState)
    } catch (error)
    {
      console.error('Error creating new game:', error);
    }
  }



  async createNewGame(): Promise<void>
  {
    try
    {

      const response = await axios.post(`${URL_BASE}/game`, this);
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


      const response = await axios.post(`${URL_BASE}/hit`, this);
      const gameState: GameState = response.data;


      // if (gameState.gameOver && gameState.winner === 'dealer')
      // {

      //   gameState.tokens = gameState.tokens - this.tokensChangeOnWinOrLoss;
      //   console.log(this.tokensChangeOnWinOrLoss)
      //   // this.setTokensChangeOnWinOrLoss(0)
      //   this._tokensChangeOnWinOrLoss = 0;

      // } else if (gameState.gameOver && gameState.winner === 'player')
      // {

      //   gameState.tokens = gameState.tokens + this.tokensChangeOnWinOrLoss;
      //   console.log(this.tokensChangeOnWinOrLoss)
      //   // this.setTokensChangeOnWinOrLoss(0)
      //   this._tokensChangeOnWinOrLoss = 0;
      //   console.log(this.tokensChangeOnWinOrLoss)
      // }

      // this._limit = [];
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

      if (gameState.gameOver && gameState.winner![0] === 'dealer')
      {
        for (let i = 0; i < gameState.hands?.length!; i++)
        {
          gameState.tokens = gameState.tokens - this._tokentsFromHand[gameState.hands![i] - 1]
          // this._prevTokentsFromHand[i] = this._tokentsFromHand[i]
          this._tokentsFromHand[gameState.hands![i] - 1] = 0;

        }

        // gameState.tokens = gameState.tokens - this.tokensChangeOnWinOrLoss;
        // // this.setTokensChangeOnWinOrLoss(0)
        // this._tokensChangeOnWinOrLoss = 0;

      }


      else if (gameState.gameOver && gameState.winner)
      {
        for (let i = 0; i < gameState.winner.length; i++)
        {
          gameState.tokens = gameState.tokens + this._tokentsFromHand[i]
          // this._prevTokentsFromHand[i] = this._tokentsFromHand[i]
          this._tokentsFromHand[i] = 0;

        }
        let sum = 0;


        for (let i = 0; i < this._tokentsFromHand.length; i++)
        {
          sum += this._tokentsFromHand[i];

        }

        gameState.tokens = gameState.tokens - sum;

        this._tokensChangeOnWinOrLoss = 0;
      }
      this.setGameState(gameState);
      // this._prevTokentsFromHand = this._tokentsFromHand;

      this._tokentsFromHand = [0, 0, 0];
    } catch (error)
    {
      console.error('Error standing:', error);
    }
  }

}




const counterStore = new GameStore();
const CounterContext: React.Context<GameStore> = createContext(counterStore);
export default CounterContext;