import "@babylonjs/loaders";
import React, { useContext, useEffect, useState } from 'react';
import CounterContext, { GameStore } from '../store/store';
import { getChipColor } from '../utilities/OverlayUtil';

function HandSpots(props: any)
{


    const chipClass = 'player_Spot'
    const [chipColor, setChipColor] = useState("defaultColor");
    const [disabled, setDisabled] = useState(true);
    const [puble, setPuble] = useState("active_button");

    const [shouldAnimate, setShouldAnimate] = useState(false);



    async function addChips(x: number): Promise<void>
    {

        await counterStore.setTokensChangeOnWinOrLoss(x);

        props.state(!props.phase);

    }
    let chipName = "Black"


    function addHand(x: number): void
    {

        const numDivs = counterStore.tokentsFromHand
        const sum = numDivs.reduce((accumulator, currentValue) =>
        {
            return accumulator + currentValue;
        }, 0);

        if (sum + props.chips <= counterStore.gameState!.tokens)
        {

            console.log(counterStore.tokentsFromHand)
            counterStore.setPlayerHands(x);

            addChips(props.chips)

            setChipColor(getChipColor(props.chips))
            chipName = getChipColor(props.chips);
            console.log(props.chips)
            counterStore.setTokensFromHand(props.chips, x - 1);
            setShouldAnimate(false);

        }

        else
        {
            console.log("nono");
            const button = document.querySelector(`.betButton:nth-child(${x}) button`);
            button?.classList.add("red-border");
            setTimeout(() =>
            {
                button?.classList.remove("red-border");
            }, 1000);
        }







    }



    useEffect(() =>
    {
        if (props.chips > 0)
        {

            setChipColor(getChipColor(props.chips))
            setDisabled(false);
        }
    }, [props.chips])


    const counterStore: GameStore = useContext(CounterContext);

    const numDivs = counterStore.tokentsFromHand



    const divs = [];
    for (let i = 1; i < numDivs.length + 1; i++)
    {
        divs.push(<div className="betButton" key={i}>

            <button disabled={disabled} onClick={() => addHand(i)} className={`${chipClass} ${puble} ${chipColor} ${shouldAnimate ? "red-border" : ""
                } `}>Bet {props.chips}$ </button>
            <p className='currentHand'>Bet:{counterStore.tokentsFromHand[i - 1]}$</p>

        </div>);
    }

    return (
        <div className='navbar_bottomClick'>
            {divs}

        </div>
    );
}

export default HandSpots;