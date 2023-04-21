import { toJS } from 'mobx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import CounterContext, { GameStore } from '../store/store';
import { hit, stand } from '../utilities/canvas';
import { getChipColor } from '../utilities/OverlayUtil';

function Hit(props: any)
{

    const [hitAble, setHitAble] = useState([true]);
    const [standAble, setStandAble] = useState([true]);
    const [handState, setHandState] = useState([true, true, true])
    const [busted, setBusted] = useState<boolean[]>([]);



    function hitPLayer(x: number, y: number)
    {


        // const score = counterStore.gameState?.playerScores!
        counterStore.setLimit(x)
        handleBoolean(y, hitAble, setHitAble, false)
        handleBoolean(y, handState, setHandState, false)





    }


    function standPLayer(x: number)
    {
        handleBoolean(x, standAble, setStandAble, false)
        handleBoolean(x, handState, setHandState, false)
        // handleBoolean(x, hitAble, setHitAble, false)
    }

    function handleBoolean(index: number, able: any, setAble: any, bool: boolean)
    {
        const newItems: boolean[] = [...able];
        newItems[index] = bool
        setAble(newItems);
    }




    function check()
    {
        console.log(hitAble)
        console.log(standAble)
        console.log(handState)
        console.log(busted)
        console.log(props)

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
        const lastBustedIndex = scores.map(score => score > 21 ? false : true);
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

        console.log(hitAble)
        console.log(standAble)
        console.log(handState)
        console.log(busted)

        const allFalse = handState.every(value => value === false);
        const standFalse = standAble.every(value => value === false);
        const bustedFalse = busted.every(value => value === false);
        if (standFalse)
        {
            stand(props.props, counterStore, props.state)
            console.log("all stand")

        }
        if (allFalse && !standFalse)
        {
            if (busted.length > 0 && !bustedFalse)
            {
                console.log(bustedFalse)

                hit(props.props, counterStore)
                console.log('All values in hitAble are false.');
                const n = counterStore.playerHands.length;
                const hitAbleArray = Array(n).fill(true);
                setHitAble(hitAbleArray);

                setHandState(standAble)
                // setHitAble(hitAble.map((value, index) => !value))
            }
        }


    }, [handState, busted]);



    const divs = [];
    for (let i = 1; i < numDivs.length + 1; i++)
    {

        divs.push(<div key={i}>

            {busted[i - 1] ? <div> {handState[i - 1] ? <div className='hitOrStand'>
                <button style={{ fontSize: "40px", color: "white" }} onClick={() => hitPLayer(counterStore.playerHands[i - 1], i - 1)} className="player_Spot, green">Hit </button>
                {standAble[i - 1] ? <button style={{ fontSize: "40px", color: "white" }} onClick={() => standPLayer(i - 1)} className="player_Spot, red">Stand </button> :
                    <div className='handDone'>Current score : 21</div>
                }
            </div> :

                !hitAble[i - 1] ? <div className='handHit'>Hand is begin hit</div> : <div className='handDone'>Hand is done</div>}


            </div> : <div className='busted'>Busted</div>}


            <p className='currentHand'>Current Hand {i} bet:{counterStore.tokentsFromHand[i - 1]}$</p>
            {/* <button onClick={check}>do something</button> */}
            {/* <p>Current Hand [i] score: {counterStore.gameState?.playerScores![i - 1]}</p>
            <button onClick={check}>do something</button> */}
            {/* <button onClick={() => hit(props.props, counterStore)} className="hit-button">Hit</button> */}
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

