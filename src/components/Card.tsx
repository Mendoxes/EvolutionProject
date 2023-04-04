import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import CounterContext, { GameStore } from "../store/store";
import { toJS } from 'mobx';
import { Rank, Card } from '../types';
//awfull way to import all the cards, but it works for now
import Canvas from './canvas';




export default function CardF(): JSX.Element
{

  const [state, setState] = useState(false);

  const counterStore: GameStore = useContext(CounterContext);

  const Counter: (() => JSX.Element) = observer(() =>
  {


    async function addChips(x: number): Promise<void>
    {
      await counterStore.setTokensChangeOnWinOrLoss(counterStore.tokensChangeOnWinOrLoss + x);

    }

    return (
      <div>
        {counterStore.gameState != null && (
          <div>
          </div>
        )}
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
