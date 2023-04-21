import React, { useContext } from 'react';
import CounterContext, { GameStore } from '../store/store';

function Navbar()
{
    const counterStore: GameStore = useContext(CounterContext);
    //   const { x } = props.gameState.player;
    const numDivs = counterStore.gameState!.hands!.length

    const divs = [];
    for (let i = 0; i < numDivs; i++)
    {
        divs.push(<div className="standActive" key={i}>Hand {i + 1} Score: {counterStore.gameState?.playerScores![i]}</div>);
    }

    return (
        <div className='navbar'>
            {divs}
        </div>
    );
}

export default Navbar;