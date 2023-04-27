import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Texture, ActionManager, ExecuteCodeAction, Mesh, DynamicTexture, FollowCamera, SceneLoader, Space, CubeTexture, PointLight, DirectionalLight, SpotLight, Animation, ArcRotateCamera } from "@babylonjs/core"
import "@babylonjs/loaders";
import { toJS } from 'mobx';
import React, { useContext, useEffect, useState } from 'react';
import CounterContext, { GameStore } from '../store/store';
import { getChipsFromTokens } from '../utilities/canvas';
import { getChipColor } from '../utilities/OverlayUtil';

function HandSpots(props: any)
{



    const chipClass = 'player_Spot'
    // const [gamePhase, setGamePhase] = useState(false);
    const [chipColor, setChipColor] = useState("defaultColor");
    const [disabled, setDisabled] = useState(true);
    const [puble, setPuble] = useState("active_button");





    async function addChips(x: number): Promise<void>
    {

        await counterStore.setTokensChangeOnWinOrLoss(x);

        props.state(!props.phase);
        // setGamePhase(!gamePhase);


    }
    let chipName = "Black"

    // let value = 500;

    // console.log(chipName)

    function addHand(x: number): void
    {

        console.log(counterStore.tokentsFromHand)
        counterStore.setPlayerHands(x);

        addChips(props.chips)

        setChipColor(getChipColor(props.chips))
        chipName = getChipColor(props.chips);

        counterStore.setTokensFromHand(props.chips, x - 1);

        // createAllInstances(props.scene);



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
    //   const { x } = props.gameState.player;
    const numDivs = counterStore.tokentsFromHand



    const divs = [];
    for (let i = 1; i < numDivs.length + 1; i++)
    {
        divs.push(<div className="betButton" key={i}>
            {/* <button id='ten' onClick={() => addHand(i)} className="betting-Chip">P1</button>
            <div id='fifty' onClick={() => addHand(i)} className="betting-Chip">P2</div> */}
            <button disabled={disabled} onClick={() => addHand(i)} className={`${chipClass} ${puble} ${chipColor} `}>Bet {props.chips}$ </button>
            <p className='currentHand'>Current Hand {i} bet:{counterStore.tokentsFromHand[i - 1]}$</p>

        </div>);
    }

    return (
        <div className='navbar_bottomClick'>
            {divs}
            {/* <button onClick={() => createAllInstances(props.scene)}>Add instance</button>
            <button onClick={disposeInstances}>Dispose</button>
            <button onClick={createTokens}>Create tokens</button> */}
        </div>
    );
}

export default HandSpots;