import React, { useRef, useEffect, useContext, useState } from 'react';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Texture, ActionManager, ExecuteCodeAction, Mesh, DynamicTexture, FollowCamera, SceneLoader, Space, CubeTexture, PointLight, DirectionalLight, SpotLight, Animation, ArcRotateCamera } from "@babylonjs/core"
// import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders";
import { AbstractMesh } from "babylonjs"
import * as GUI from "babylonjs-gui";
import { cards } from '../assets/pngCards';
import CounterContext, { GameStore } from '../store/store';
import '../App.css'
import { addChips, createNewGame, disposeCards, getChipsFromTokens, hit, readyTable, stand } from '../utilities/canvas';
import GamePhase from './gamePhase';
import { toJS } from 'mobx';
import Overlay from './overlay';
import Navbar from './navbar';
import HandSpots from './handSpots';
import Hit from './Hit';
// import { burnCards, cardInstances } from './canvasUtils/canvasUtils';


let originalMesh: any = null;
let clonedMeshes: any = [];


export default function Canvas() 
{

    const mountedStyle = {
        animation: "inAnimation 250ms ease-in"
    };
    const unmountedStyle = {
        animation: "outAnimation 270ms ease-out",
        animationFillMode: "forwards"
    };

    const canvasRef = useRef(null);
    const counterStore: GameStore = useContext(CounterContext);
    const [sceneState, setScene] = useState<Scene | null>(null);
    const [gameOver, setGameOVer] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);


    const [betting, setBetting] = useState(false);
    const [table, setTable] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [gamePhase, setGamePhase] = useState(false);
    const [chip, setChip] = useState(0);
    const [betPerPlayer, setBetPerPlayer] = useState([0, 0, 0]);
    const [gameStart, setGameStart] = useState(false);

    useEffect(() =>
    {
        if (counterStore.gameState?.gameOver)
        {
            setGameOVer(false);


        }
    }, [counterStore.gameState?.gameOver])


    const originalMeshRef = useRef(originalMesh);
    const clonedMeshesRef = useRef(clonedMeshes);






    function addClone(distanceBetweenClones: any)
    {

        if (originalMeshRef.current)
        {
            const clone = originalMeshRef.current.clone(
                `clone_${clonedMeshesRef.current.length}`,
                null,
                true
            );
            clone.position.y += clonedMeshesRef.current.length * distanceBetweenClones;
            clonedMeshesRef.current.push(clone);
        }


    }

    function removeClone()
    {
        if (clonedMeshesRef.current.length > 1)
        {


            const meshToRemove = clonedMeshesRef.current.pop();
            meshToRemove.dispose();
        }
    }

    interface InstanceMap
    {
        [loaderType: string]: any[];
    }


    const [instances, setInstances] = useState<InstanceMap>({}); //MOVE TO MOBX STORE


    //MOVE TO UTILS
    function createInstance(
        loaderType: string,
        modelPath: string,
        scene: Scene | null,
        position?: Vector3 | null,
        scaling?: Vector3 | null
    ): void
    {

        if (!instances[loaderType])
        {
            setInstances((prevInstances) => ({
                ...prevInstances,
                [loaderType]: [], // create empty array if no instances yet
            }));
        }

        SceneLoader.ImportMesh("", "./assets/", modelPath, scene, (newMeshes) =>
        {

            const instance = newMeshes[1];
            instance.scaling = scaling ?? new Vector3(0.6, 0.6, 0.6);
            // instance.position = position ?? new Vector3(0, -1.3, -0.4);
            instance.position = position ?? new Vector3(0, 0, -13);


            setInstances((prevInstances) => ({
                ...prevInstances,
                [loaderType]: [...prevInstances[loaderType], instance], // add instance to instances array
            }));
        });
    }

    function removeInstance(loaderType: string, instanceIndex: number): void
    {
        if (instances[loaderType] && instances[loaderType][instanceIndex])
        {

            instances[loaderType][instanceIndex].dispose(); // remove instance from scene
            setInstances((prevInstances) =>
            {
                const newInstances = [...prevInstances[loaderType]];
                newInstances.splice(instanceIndex, 1); // remove instance from instances array
                return {
                    ...prevInstances,
                    [loaderType]: newInstances,
                };
            });
        }
    }



    function createAllInstances(scene: Scene | null): void
    {
        //what type is tokenNumbers?

        //TO CONSTS


        const tokenNumbers: { [key: string]: number } = getChipsFromTokens(counterStore.gameState!.tokens)

        for (const [key, value] of Object.entries(tokenNumbers))
        {
            const ten = { xpos: -2, zpos: -1 };
            const fifty = { xpos: -1.7, zpos: 0.5 };
            const hung = { xpos: -1.9, zpos: -1.5 };
            const fivehung = { xpos: -0.7, zpos: 0.8 };

            for (let i = 0; i < value; i++)
            {

                if (key === "ten")
                {


                    createInstance(key, `${key}.glb`, scene, new Vector3(ten.xpos, -4 + tokenNumbers[key] / 5 - i / 10, ten.zpos), null);

                } else if (key === "fifty")
                {
                    createInstance(key, `${key}.glb`, scene, new Vector3(fifty.xpos, -3.5 + tokenNumbers[key] / 5 - i / 10, fifty.zpos), null);

                }

                else if (key === "hung")
                {
                    createInstance(key, `${key}.glb`, scene, new Vector3(hung.xpos, -4 + tokenNumbers[key] / 5 - i / 10, hung.zpos), null);

                }



                else
                {



                    createInstance(key, `${key}.glb`, scene, new Vector3(fivehung.xpos, -3.5 + tokenNumbers[key] / 5 - i / 10, fivehung.zpos), null);
                }
            }
        }
    }




    // async function addChips(x: number): Promise<void>
    // {

    //     await counterStore.setTokensChangeOnWinOrLoss(x);

    //     // createAllInstances(sceneState);
    //     setGamePhase(!gamePhase);


    // }



    useEffect(() =>
    {


        if (canvasRef.current)
        {
            const engine = new Engine(canvasRef.current);
            const scene: Scene = new Scene(engine);
            setScene(scene);
            new HemisphericLight("light", new Vector3(0, 1, 0), scene);
            const camera = new FollowCamera("camera", new Vector3(0, 7, -18), scene);
            // const camera = new ArcRotateCamera("camera", Math.PI, Math.PI, 115, new Vector3(0, 7, -18), scene);
            // const camera = new FollowCamera("camera", new Vector3(0, 9, -9), scene);
            // camera.radius = 20; // distance from the target
            // camera.heightOffset = 500; // height above the target
            camera.setTarget(new Vector3(0, -10, 12));
            camera.attachControl(canvasRef.current);


            const animationFrames = [
                { frame: 0, value: new Vector3(0, 25, -40) },
                { frame: 60, value: new Vector3(0, 4, -12) },
            ];

            // Create the animation object
            const cameraAnimation = new Animation(
                "cameraAnimation",
                "position",
                30, // Number of frames per second
                Animation.ANIMATIONTYPE_VECTOR3,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );

            // Set the keys of the animation
            cameraAnimation.setKeys(animationFrames);

            // Attach the animation to the camera
            camera.animations.push(cameraAnimation);

            // Start the animation
            scene.beginAnimation(camera, 0, 60, false);


            SceneLoader.ImportMesh("", "./", "tabel7.glb", scene, (newMeshes) =>
            {


                newMeshes[0].position = new Vector3(0, -13, 9);
                newMeshes[0].rotate(new Vector3(0, 1, 0), Math.PI, Space.WORLD);

            });

            scene.environmentTexture = new CubeTexture("environmentSpecular.env", scene);
            if (clonedMeshesRef.current.length === 0)
            {

            }



            engine.runRenderLoop(() =>
            {
                scene.render();
            });

            return () =>
            {
                if (scene)
                {
                    scene.dispose();
                }
                if (engine)
                {
                    engine.dispose();
                }
            };

        }






    }, []);


    useEffect(() =>
    {

        if (counterStore.gameState?.tokens !== undefined)

            createAllInstances(sceneState)

    }, [gameOver])



    useEffect(() =>
    {

        if (counterStore.gameState?.gameOver !== undefined && gameStart === false)


            setBetting(true)

        if (counterStore.gameState?.gameOver === true)
        {
            //clean up
            disposeCards();
            counterStore.setPlayerNumber([]);
        }

    }, [counterStore.gameState?.gameOver])






    function hitPLayer(x: number)
    {
        counterStore.setLimit(x)

    }









    return (



        <div style={{ position: 'relative', display: "flex" }}>

            <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />


            {/* <Overlay></Overlay> */}
            <div className={`overlay ${gameStarted ? 'fadeOut' : ''}`}>
                {/* <div className='navbar'> oki </div> */}
                {counterStore.gameState?.hands && <Navbar></Navbar>}
                {/* <h1>Blackjack Game</h1> */}
                {!gameOver && (
                    <div className="start-button" style={!gameOver ? mountedStyle : unmountedStyle}>
                        {gameStarted && counterStore.tokensChangeOnWinOrLoss ? <button onClick={() => createNewGame(sceneState, counterStore, setGameOVer, setBetting, setGameStart)}>Start Game</button> : null}
                        {!gameStarted && <button onClick={() => readyTable(counterStore, setGameStarted)}>Set table</button>}

                    </div>
                )}
                {gameOver && counterStore.tokensChangeOnWinOrLoss ?
                    <div className="game-buttons" style={counterStore.tokensChangeOnWinOrLoss ? mountedStyle : unmountedStyle}>
                        {/* <button onClick={() => hit(sceneState, counterStore)} className="hit-button">Hit</button>
                        <button onClick={() => stand(sceneState, counterStore, setGameStart)} className="stand-button">Stand</button> */}

                        {/* <div className="bar">
                            <button id='ten' onClick={() => hitPLayer(1)} className="betting-Chip">HIT P1</button>
                            <div id='fifty' onClick={() => hitPLayer(2)} className="betting-Chip"> HIT P2</div>
                            <div id='hundred' onClick={() => hitPLayer(3)} className="betting-Chip">HIT P3</div>



                        </div> */}
                        <Hit props={sceneState} state={setGameStart}></Hit>
                    </div>


                    : null
                }

                {betting && <div>

                    <div className="bar" style={{ marginTop: "2rem" }}>
                        <button id='ten' onClick={() => setChip(10)} className="betting-Chip">10</button>
                        <div id='fifty' onClick={() => setChip(50)} className="betting-Chip">50</div>
                        <div id='hundred' onClick={() => setChip(100)} className="betting-Chip">100</div>
                        <div id='fivehundred' onClick={() => setChip(500)} className="betting-Chip">500</div>

                    </div>

                    {/* 
                    <div className="bar">
                        <button id='ten' onClick={() => addHand(1)} className="betting-Chip">P1</button>
                        <div id='fifty' onClick={() => addHand(2)} className="betting-Chip">P2</div>
                        <div id='hundred' onClick={() => addHand(3)} className="betting-Chip">P3</div>


                    </div> */}

                    <HandSpots chips={chip} state={setGamePhase} phase={gamePhase}></HandSpots>
                </div>}

                <div className="tokens">
                    <p> Tokens: {(counterStore.gameState?.tokens || 0) - counterStore.tokensChangeOnWinOrLoss}</p>
                    <p>Currently betting: {counterStore.tokensChangeOnWinOrLoss} </p>


                    <button onClick={() => addClone(0.1)}>Add clone</button>
                    <button onClick={removeClone}>remove clone</button>

                </div>

            </div>

        </div>


    );
}