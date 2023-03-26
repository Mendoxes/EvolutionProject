import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import CounterContext, { GameStore } from "../store/store";
import { toJS } from 'mobx';
import { Rank, Card } from '../types';
//awfull way to import all the cards, but it works for now
import SingleCard from './SingleCard';
import { CBB } from '../svg'




export default function CardF(): JSX.Element
{

  const [state, setState] = useState(false);

  const counterStore: GameStore = useContext(CounterContext);

  const Counter: (() => JSX.Element) = observer(() =>
  {

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
      // await counterStore.stand();

    }


    async function stand(): Promise<void>
    {
      setState(true);
      await counterStore.stand();

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


          </div>
        )}

        <div><button onClick={createNewGame}>Create new Game</button></div>

        <div><button onClick={hit}>HIT IT</button></div>
        <div><button onClick={stand}>Stand</button></div>

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
