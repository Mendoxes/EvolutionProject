import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import CounterContext, { GameStore } from "../store/store";

import Canvas from './canvas';

export const StoreObserver: (() => JSX.Element) = observer(() =>
{

  const counterStore: GameStore = useContext(CounterContext);

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
