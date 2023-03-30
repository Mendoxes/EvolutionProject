import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import CounterContext, { GameStore } from "../store/store";
import { toJS } from 'mobx';
import { Rank, Card } from '../types';
//awfull way to import all the cards, but it works for now
import SingleCard from './SingleCard';
import { CBB } from '../svg'
import Canvas from './canvas';




export default function CardF(): JSX.Element
{

  const [state, setState] = useState(false);

  const counterStore: GameStore = useContext(CounterContext);

  console.log(counterStore)

  const Counter: (() => JSX.Element) = observer(() =>
  {


    console.log(counterStore)
    async function createNewGame(): Promise<void>
    {
      await counterStore.createNewGame();
      if (counterStore.gameState != null)
      {

      }
    }

    async function hit(): Promise<void>
    {
      await counterStore.hit();
    }


    async function stand(): Promise<void>
    {
      setState(true);
      await counterStore.stand();

    }

    async function addChips(x: number): Promise<void>
    {
      await counterStore.setTokensChangeOnWinOrLoss(counterStore.tokensChangeOnWinOrLoss + x);

    }

    return (
      <div>
        {counterStore.gameState != null && (
          <div>
            {counterStore.gameState!.gameOver ? <div>GAME OVER, Winner: {counterStore.gameState.winner}</div> : <div>GAME NOT OVER</div>}
            <div>
              {counterStore.gameState.dealerHand.map((card, index) =>
              {
                if (!state)
                {

                  return <>{<SingleCard {...card} isDealer={true} index={index} />} <CBB></CBB></>

                } else
                {

                  return <>{<SingleCard {...card} isDealer={true} index={index} />}</>;
                }
              })}</div>


            <div>{toJS(counterStore.gameState.dealerScore)}</div>
            <div>
              {counterStore.gameState.playerHand.map((card: Card, index) =>
              {

                return <>{<SingleCard {...card} isDealer={true} index={index} />}</>;

              })}</div>


            <div>{toJS(counterStore.gameState.playerScore)}</div>
            <div>DECK LENGTH: {toJS(counterStore.gameState.deck.length)}</div>
            <div>Tokens: {toJS(counterStore.gameState.tokens)}</div>


          </div>
        )}


        {counterStore.tokensChangeOnWinOrLoss && <>    <div> <button onClick={createNewGame}>Create new Game</button></div>

          <div><button disabled={counterStore.gameState?.gameOver} onClick={hit}>HIT IT</button></div>
          <div><button disabled={counterStore.gameState?.gameOver} onClick={stand}>Stand</button></div></>}



        <div>

          <div>TOKENS ON THE BET: {counterStore.tokensChangeOnWinOrLoss}</div>

          {Array.from({ length: 5 }).map((_, index) => (<button onClick={() => addChips((index + 5) * 5)}> Add ${(index + 5) * 5} chips</button>))}
        </div>

        <Canvas></Canvas>

      </div>
    );
  });


  return (
    <div>
      <div>
      </div>
      <Counter />

    </div>
  )
}
