import React, { useRef, useEffect, useContext, useState } from 'react';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Texture, ActionManager, ExecuteCodeAction, Mesh, DynamicTexture, FollowCamera, SceneLoader, Space, CubeTexture, PointLight, DirectionalLight, SpotLight, Animation, ArcRotateCamera, Quaternion, Matrix } from "@babylonjs/core"
// import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders";
import { AbstractMesh } from "babylonjs"
import * as GUI from "babylonjs-gui";
import { cards } from '../assets/pngCards';
import CounterContext, { GameStore } from '../store/store';
import '../App.css'
import { addChips, checkCamera, checkCamera2, checkCamera3, createNewGame, createTokensOnTable, disposeCards, getChipsFromTokens, hit, readyTable, stand } from '../utilities/canvas';
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



    const [betting, setBetting] = useState<null | boolean>(null);
    const [table, setTable] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [gamePhase, setGamePhase] = useState(false);
    const [chip, setChip] = useState(10);
    const [betPerPlayer, setBetPerPlayer] = useState([0, 0, 0]);
    const [gameStart, setGameStart] = useState(false);
    const [board, setBoard] = useState(true);
    const [lastClicked, setLastClicked] = useState('ten');
    const [isLoaded, setIsLoaded] = useState(false);


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
    const [instances, setInstances] = useState<InstanceMap>({});
    const [sceneInstance, setSceneInstance] = useState<Scene | null>(null);

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
            instance.scaling = scaling ?? new Vector3(0.4, 0.4, 0.4);
            instance.position = position ?? new Vector3(0, 0, -13);

            setInstances((prevInstances) => ({
                ...prevInstances,
                [loaderType]: [...prevInstances[loaderType], instance], // add instance to instances array
            }));

            if (!sceneInstance)
            {
                setSceneInstance(scene);
            }
        });
    }

    function disposeInstances()
    {
        for (const loaderType in instances)
        {
            const loaderInstances = instances[loaderType];
            for (const instance of loaderInstances)
            {
                instance.dispose();
            }
        }
        setInstances({});
    }



    function createAllInstances(scene: Scene | null, index: number): void
    {


        const tokenNumbers: { [key: string]: number } = getChipsFromTokens(counterStore.tokentsFromHand[index])

        for (const [key, value] of Object.entries(tokenNumbers))
        {


            const chipPositions = [{ ten: { xpos: 2, ypoz: -3.4, zpos: -1.2 }, fifty: { xpos: 2.8, ypoz: -3.4, zpos: -0.4 }, hung: { xpos: 2.9, ypoz: -3.45, zpos: -0.4 }, fivehung: { xpos: 4.2, ypoz: -3.4, zpos: 0.5 } },
            { ten: { xpos: -2, ypoz: -3.5, zpos: -1.9 }, fifty: { xpos: -1.3, ypoz: -3.5, zpos: -1.7 }, hung: { xpos: -3.4, ypoz: -3.45, zpos: -2.1 }, fivehung: { xpos: -3.4, ypoz: -3.4, zpos: -1.5 } },
            { ten: { xpos: -7.2, ypoz: -3.3, zpos: -0.5 }, fifty: { xpos: -7.9, ypoz: -3.3, zpos: 0.2 }, hung: { xpos: -10, ypoz: -3.31, zpos: 0.6 }, fivehung: { xpos: -8.6, ypoz: -3.3, zpos: 0.9 } }]



            for (let i = 0; i < value; i++)
            {

                if (key === "ten")
                {


                    createInstance(key, `${key}.glb`, scene, new Vector3(chipPositions[index].ten.xpos, chipPositions[index].ten.ypoz + tokenNumbers[key] / 5 - i / 10, chipPositions[index].ten.zpos), null);

                } else if (key === "fifty")
                {
                    createInstance(key, `${key}.glb`, scene, new Vector3(chipPositions[index].fifty.xpos, chipPositions[index].fifty.ypoz + tokenNumbers[key] / 5 - i / 10, chipPositions[index].fifty.zpos), null);

                }

                else if (key === "hung")
                {
                    createInstance(key, `${key}.glb`, scene, new Vector3(chipPositions[index].hung.xpos, chipPositions[index].hung.ypoz + tokenNumbers[key] / 5 - i / 10, chipPositions[index].hung.zpos), null);

                }



                else
                {



                    createInstance(key, `${key}.glb`, scene, new Vector3(chipPositions[index].fivehung.xpos, chipPositions[index].fivehung.ypoz + tokenNumbers[key] / 5 - i / 10, chipPositions[index].fivehung.zpos), null);
                }
            }
        }
    }



    useEffect(() =>
    {


        if (canvasRef.current)
        {
            const engine = new Engine(canvasRef.current);
            const scene = new Scene(engine);
            setScene(scene);

            const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

            const camera = new ArcRotateCamera("camera", 0, Math.PI / 6, 15, Vector3.Zero(), scene);
            camera.attachControl(canvasRef.current, false);
            camera.setTarget(new Vector3(0, -10, 12));

            const animationFrames = [];

            const center = new Vector3(0, 2, -11);
            const radius = 5;
            const framesPerSecond = 10;
            const numFrames = 120;

            for (let i = 0; i <= numFrames; i++)
            {
                const angle = (2 * Math.PI * i) / numFrames;
                const x = center.x + radius * Math.sin(angle);
                const y = center.y;
                const z = center.z + radius * Math.cos(angle);
                const position = new Vector3(x, y, z);

                animationFrames.push({ frame: i, value: position });
            }

            const cameraAnimation = new Animation(
                "cameraAnimation",
                "position",
                framesPerSecond,
                Animation.ANIMATIONTYPE_VECTOR3,
                Animation.ANIMATIONLOOPMODE_CYCLE
            );
            cameraAnimation.setKeys(animationFrames);
            camera.animations.push(cameraAnimation);

            scene.beginAnimation(camera, 0, numFrames, true);



            SceneLoader.ImportMesh("", "./", "tabel7.glb", scene, (newMeshes) =>
            {


                newMeshes[0].position = new Vector3(0, -13, 9);
                newMeshes[0].rotate(new Vector3(0, 1, 0), Math.PI, Space.WORLD);

            });





            scene.environmentTexture = new CubeTexture("environmentSpecular.env", scene);
            if (clonedMeshesRef.current.length === 0)
            {

            }


            const numOfCards = 15;
            const cardWidth = 2.5;
            const cardHeight = 4.3;


            const cardMaterial = new StandardMaterial("cardMaterial", scene);
            cardMaterial.diffuseTexture = new Texture(cards["back"], scene);


            for (let i = 0; i < numOfCards; i++)
            {
                const card1 = MeshBuilder.CreatePlane("card" + i, { width: cardWidth, height: cardHeight }, scene);
                card1.rotation.x = Math.PI / 2;
                card1.position.copyFrom(new Vector3(-5.1, -2, 9))
                card1.position.y = (i - 102) * cardHeight / 200; // stack each card on top of the previous one
                card1.material = cardMaterial;
            }



            createTokensOnTable(scene);



            const skybox = MeshBuilder.CreateBox("skyBox", { size: 500.0 }, scene);
            const skyboxMaterial = new StandardMaterial("skyBoxMaterial", scene);
            skyboxMaterial.backFaceCulling = false;
            // skyboxMaterial.reflectionTexture = new CubeTexture("./assets/skybox/", scene, ["bkg1_right.png", "bkg1_top.png", "bkg1_front.png", "bkg1_left.png", "bkg1_bot.png", "bkg1_back.png"]);
            skyboxMaterial.reflectionTexture = new CubeTexture("./assets/skybox/", scene, ["right.png", "top.png", "front.png", "left.png", "bot.png", "back.png"]);
            skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
            skyboxMaterial.disableLighting = true;
            skybox.material = skyboxMaterial;





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





    // useEffect(() =>
    // {

    //     if (counterStore.gameState?.tokens !== undefined)

    //         createAllInstances(sceneState)

    // }, [gameOver])



    useEffect(() =>
    {

        if (counterStore.gameState?.gameOver !== undefined && gameStart === false && betting === null)


            setBetting(true)

        if (counterStore.gameState?.gameOver === true)
        {
            //clean up
            setTimeout(() =>
            {
                checkCamera3(sceneState)
                setBoard(false)
                setBetting(true)
                disposeCards();
                counterStore.setPlayerNumber([]);
                console.log(counterStore.tokentsFromHand)

                // setGameStart(false)
            }, 2000)
        }

    }, [counterStore.gameState?.gameOver])



    function createGameWithTokens()
    {
        createAllInstances(sceneState, 0);
        createAllInstances(sceneState, 1);
        createAllInstances(sceneState, 2);
        createNewGame(sceneState, counterStore, setGameOVer, setBetting, setGameStart)
        counterStore._prevTokentsFromHand = [...counterStore.tokentsFromHand];

    }


    useEffect(() =>
    {
        if (counterStore.gameState?.gameOver === true)
        {
            // setBoard(false)
            //clean up
            disposeInstances()


        }

    }, [counterStore.gameState?.gameOver])



    useEffect(() =>
    {
        if (board)
        {
            checkCamera(sceneState)

        }
    }, [board])


    const Check = () =>
    {
        const [state, setState] = useState(10)

        useEffect(() =>
        {
            const interval = setInterval(() =>
            {
                setState((prevState) => prevState - 1);
            }, 1000);

            if (state === 0)
            {
                setBoard(true);
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }, [state]);

        if (!counterStore.gameState?.gameOver)
        {
            return null;
        }

        const winners = counterStore.gameState.winner || [];
        const hands = counterStore.gameState.hands || [];
        const dealerWon = winners.length === 0 && winners[0] === "dealer";
        const score = counterStore._prevTokentsFromHand;


        const indexMap: any = {};
        hands.forEach((hand, index) =>
        {
            indexMap[hand - 1] = index;
        });


        return (
            <div
                style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "100vw",
                    height: "100vh",
                    opacity: 0.8,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {!dealerWon ? (
                    <div>

                        <div> Dealer Score: {counterStore.gameState.dealerScore}</div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Result</th>

                                    <th>Score</th>
                                    <th>Tokens</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hands.map((hand, index) =>
                                {

                                    const player = hand - 1;
                                    const winnerIndex = indexMap[player];
                                    const won = (winners as number[]).includes(winnerIndex);
                                    const color = won ? "green" : "red";
                                    const check = won ? "✔" : "✘";
                                    const text = won ? "won" : "lost";
                                    const token = won ? "+" : "-";

                                    console.log(winners + "winners")
                                    console.log(hands + "hands")
                                    console.log(hand + "hand")
                                    console.log(player + "player")
                                    console.log(won + "won")
                                    return (
                                        <tr key={index} style={{ color: "white" }}>
                                            <td>Player {hand}</td>
                                            <td style={{ color }}>
                                                {check}
                                            </td>

                                            <td>  ({counterStore.gameState?.playerScores![index]})</td>
                                            <td>
                                                {token}{score[hand - 1]}

                                            </td>


                                        </tr>

                                    );
                                })}


                            </tbody>
                        </table>
                        <div>Next game will begin in: {state} seconds</div>
                        {/* <div>Next game will begin in: {state}
                            <div className='progress-bar'>
                                <div className='progress'></div>
                                </div>
                                </div> */}
                        <div className="range" data-value={100 - state * 10}>
                            <div className="range__label"></div>
                        </div>
                        <div>
                            <button className='mysterious-button' onClick={() => setBoard(!board)}> reset</button></div>
                        {/* <a className='again'><span className='againSpan'></span>Eslam</a> */}
                    </div>
                ) : (
                    <p>Dealer won</p>
                )}
            </div>
        );
    };



    function tableSet()
    {

        checkCamera(sceneState)
        readyTable(counterStore, setGameStarted)

    }


    const handleClick = (id: string, chip: number) =>
    {
        setLastClicked(id);
        setChip(chip)
    };


    return (



        <div style={{ position: 'relative', display: "flex" }}>


            <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />


            {/* <Overlay></Overlay> */}
            <div className={`overlay ${gameStarted ? 'fadeOut' : ''}`}>
                {/* <div className='navbar'> oki </div> */}
                {counterStore.gameState?.hands && <Navbar></Navbar>}
                {/* <h1>Blackjack Game</h1> */}
                {!gameOver && (
                    <div className='margin' style={!gameOver ? mountedStyle : unmountedStyle}>
                        {gameStarted && counterStore.tokentsFromHand[0] | counterStore.tokentsFromHand[1] | counterStore.tokentsFromHand[2] ? <button className="glow" onClick={createGameWithTokens}>Start Game</button> : null}
                        {!gameStarted && <a className='again' onClick={tableSet}><span className='againSpan'></span>Set table</a>}

                    </div>
                )}
                {gameOver && counterStore.tokensChangeOnWinOrLoss ?
                    <div className="game-buttons" style={counterStore.tokensChangeOnWinOrLoss ? mountedStyle : unmountedStyle}>

                        <Hit props={sceneState} state={setGameStart}></Hit>
                    </div>


                    : null
                }

                {betting && <div>

                    <div className="bar" style={{ margin: "2rem" }}>
                        {/* <button id='ten' onClick={() => setChip(10)} className="betting-Chip">10</button>
                        <button  id='fifty' onClick={() => setChip(50)} className="betting-Chip">50</button>
                        <button  id='hundred' onClick={() => setChip(100)} className="betting-Chip">100</button>
                        <button  id='fivehundred' onClick={() => setChip(500)} className="betting-Chip">500</button> */}
                        <button
                            id='ten'
                            onClick={() => handleClick('ten', 10)}
                            className="betting-Chip"
                            style={{ transform: lastClicked === "ten" ? 'scale(1.2)' : "scale(1)", boxShadow: lastClicked === 'ten' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
                        >
                            10
                        </button>
                        <button
                            id='fifty'
                            onClick={() => handleClick('fifty', 50)}
                            className="betting-Chip"
                            style={{ scale: lastClicked === "fifty" ? '1.2' : "1", boxShadow: lastClicked === 'fifty' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
                        >
                            50
                        </button>
                        <button
                            id='hundred'
                            onClick={() => handleClick('hundred', 100)}
                            className="betting-Chip"
                            style={{ scale: lastClicked === "hundred" ? '1.2' : "1", boxShadow: lastClicked === 'hundred' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
                        >
                            100
                        </button>
                        <button
                            id='fivehundred'
                            onClick={() => handleClick('fivehundred', 500)}
                            className="betting-Chip"
                            style={{ scale: lastClicked === "fivehundred" ? '1.2' : "1", boxShadow: lastClicked === 'fivehundred' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
                        >
                            500
                        </button>

                    </div>



                    <HandSpots chips={chip} state={setGamePhase} phase={gamePhase} scene={sceneState}></HandSpots>
                </div>}

                <div className="tokens">

                    {!board && <Check></Check>}
                </div>

            </div>

        </div>


    );
}