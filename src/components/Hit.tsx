import { toJS } from 'mobx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CounterContext, { GameStore } from '../store/store';
import { checkCamera2, hit, stand } from '../utilities/canvas';
import miniCamera from "../assets/mini-camera.png"
import { disableButtonStyle } from '../consts/canvas';

function Hit(props: any)
{

    const [hitAble, setHitAble] = useState([true]);
    const [standAble, setStandAble] = useState([true]);
    const [handState, setHandState] = useState([true, true, true])
    const [busted, setBusted] = useState<boolean[]>([]);
    const [disabled, setDisabled] = useState<boolean>(false)



    function hitPLayer(x: number, y: number)
    {


        counterStore.setLimit(x)
        handleBoolean(y, hitAble, setHitAble, false)
        handleBoolean(y, handState, setHandState, false)
    }


    function standPLayer(x: number)
    {
        handleBoolean(x, standAble, setStandAble, false)
        handleBoolean(x, handState, setHandState, false)

    }

    function handleBoolean(index: number, able: any, setAble: any, bool: boolean)
    {
        const newItems: boolean[] = [...able];
        newItems[index] = bool
        setAble(newItems);
    }


    const counterStore: GameStore = useContext(CounterContext);
    const numDivs = counterStore.playerHands;


    useEffect(() =>
    {

        const n = counterStore.playerHands.length;
        const hitAbleArray = Array(n).fill(true);
        setHitAble(hitAbleArray);
        setStandAble(hitAbleArray);
        setHandState(hitAbleArray);
        setBusted(hitAbleArray)

    }, [])




    useEffect(() =>
    {
        const scores = counterStore.gameState?.playerScores || [];
        const lastBustedIndex = scores.map(score => score >= 21 ? false : true);
        setBusted(lastBustedIndex);
    }, [counterStore.gameState?.playerScores]);






    useEffect(() =>
    {

        if (busted.length > 0)
        {
            busted.forEach((value, index) =>
            {
                if (value === false)
                {
                    handState[index] = false
                    standAble[index] = false
                }
            })

        }

    }, [busted])


    useEffect(() =>
    {



        const allFalse = handState.every(value => value === false);
        const standFalse = standAble.every(value => value === false);
        const bustedFalse = busted.every(value => value === false);
        if (standFalse)
        {
            stand(props.props, counterStore, props.state)


        }
        if (allFalse && !standFalse)
        {
            if (busted.length > 0 && !bustedFalse)
            {


                hit(props.props, counterStore)

                const n = counterStore.playerHands.length;
                const hitAbleArray = Array(n).fill(true);
                setHitAble(hitAbleArray);

                setHandState(standAble)

            }
        }


    }, [handState, busted]);



    function doubleChips(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, token: number, index: number)
    {
        counterStore.setTokensFromHand(token, index);
        const button = event.currentTarget;
        button.disabled = true;
        Object.assign(button.style, disableButtonStyle);
        setDisabled(!disabled);
        counterStore._prevTokentsFromHand = [...counterStore.tokentsFromHand];
    }



    const divs = [];
    for (let i = 1; i < numDivs.length + 1; i++)
    {
        const BustOrBlackjack = counterStore.gameState!.playerScores![i - 1] > 21 ? true : false
        const playerHandEqual2 = counterStore.gameState!.playerHands![i - 1].length === 2 ? true : false

        divs.push(<div className='ok' key={i}>

            {busted[i - 1] ? <div> {handState[i - 1] ? <div className='hitOrStand'>
                <button style={{ color: "white" }} onClick={() => hitPLayer(counterStore.playerHands[i - 1], i - 1)} className="player_Spot green">Hit </button>
                {standAble[i - 1] ? <button style={{ color: "white" }} onClick={() => standPLayer(i - 1)} className="player_Spot red">Stand </button> :
                    <div className='handDone'>Current score : 21</div>
                }
            </div> :

                !hitAble[i - 1] ? <div className='handHit'>Awaiting Card<span className="dots">...</span></div> : <div className='handDone'>Hand is done</div>}


            </div> : <div >{BustOrBlackjack ? <div className='busted'>Busted</div> : <div className='blackjack'>BlackJack</div>}</div>}



            <div style={{ display: 'flex', alignItems: 'center' }} className='currentHand actionCurrentHand'>
                <span style={{ flex: 1, textAlign: 'center' }}>{counterStore.tokentsFromHand[i - 1]}$   {playerHandEqual2 && <button className='golden-btn' onClick={(event) => doubleChips(event, counterStore.tokentsFromHand[i - 1], i - 1)}>2X</button>}</span>

                <img onClick={() => checkCamera2(props.props, counterStore.gameState?.hands![i - 1] as number)} style={{ width: "20px", marginLeft: '5px' }} src={miniCamera} alt="camera" />
            </div>

        </div>



        );
    }

    return (
        <div className='navbar_bottom'>
            {divs}

        </div>
    );
}

export default Hit;

