import React, { useRef, useEffect, useContext, useState } from 'react';
import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Texture, SceneLoader, Space, CubeTexture, Animation, ArcRotateCamera } from "@babylonjs/core"
import "@babylonjs/loaders";
import { cards } from '../assets/pngCards';
import CounterContext, { GameStore } from '../store/store';
import '../App.css'
import { ChangeCamera, checkCamera, checkCamera3, createChipStacks, createNewGame, createTokensOnTable, disposeCards, getChipsFromTokens, hit, readyTable } from '../utilities/canvas';
import Navbar from './navbar';
import HandSpots from './handSpots';
import Hit from './Hit';
import { Statistics } from './Statistics';
import { mountedStyle, unmountedStyle } from '../consts/canvas';
import repeatIcon from '../assets/repeat2.png';
import ChipSelector from './ChipSelector';


let clonedMeshes: any = [];


export default function Canvas() 
{
    interface InstanceMap
    {
        [loaderType: string]: any[];
    }

    const canvasRef = useRef(null);
    const counterStore: GameStore = useContext(CounterContext);
    const [sceneState, setScene] = useState<Scene | null>(null);
    const [gameOver, setGameOVer] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [betting, setBetting] = useState<null | boolean>(null);
    const [gamePhase, setGamePhase] = useState(false);
    const [chip, setChip] = useState(10);
    const [refreesh, setRefresh] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [board, setBoard] = useState(true);
    const [lastClicked, setLastClicked] = useState('ten');
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [loaded, setLoaded] = useState<boolean[]>([false, false, false]);
    const [instances, setInstances] = useState<InstanceMap>({});
    const [sceneInstance, setSceneInstance] = useState<Scene | null>(null);


    useEffect(() =>
    {
        if (counterStore.gameState?.gameOver)
        {
            setGameOVer(false);


        }
    }, [counterStore.gameState?.gameOver])

    const clonedMeshesRef = useRef(clonedMeshes);




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
                [loaderType]: [], // create empt array if no instances yet
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


        if (scene)
        {
            createChipStacks(tokenNumbers, index, scene, createInstance)
        }

    }



    useEffect(() =>
    {


        if (canvasRef.current)
        {
            const engine = new Engine(canvasRef.current);
            const scene = new Scene(engine);
            setScene(scene);
            new HemisphericLight("light", new Vector3(0, 1, 0), scene);
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

            const onAnimationStart = () =>
            {

                setTimeout(() =>
                {
                    setLoaded(prevState =>
                    {
                        const newState = [...prevState];
                        newState[2] = true;
                        return newState;
                    });
                }, 1500);
            };

            scene.beginAnimation(camera, 0, numFrames, true, undefined);


            onAnimationStart();

            SceneLoader.ImportMesh("", "./", "tabel7.glb", scene, (newMeshes) =>
            {


                newMeshes[0].position = new Vector3(0, -13, 9);
                newMeshes[0].rotate(new Vector3(0, 1, 0), Math.PI, Space.WORLD);
                setLoaded(prevState =>
                {
                    const newState = [...prevState];
                    newState[0] = true;
                    return newState;
                });


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



            createTokensOnTable(scene, loaded);

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

    let currentView = 1; // initialize current view to 1
    let prevView = 3; // initialize previous view to 3

    document.addEventListener("keypress", (event) =>
    {
        if (event.key === "c" || event.key === "C")
        {
            // update current and previous views
            if (currentView <= 3)
            {
                currentView = currentView + 1;
            }
            else
            {

                currentView = 1;
            }
            ChangeCamera(sceneState, currentView, prevView);
        }
    });

    useEffect(() =>
    {

        if (counterStore.gameState?.gameOver !== undefined && gameStart === false && betting === null)

            setBetting(true)

        if (counterStore.gameState?.gameOver === true)
        {
            setTimeout(() =>
            {
                checkCamera3(sceneState)
                setBoard(false)
                setBetting(true)
                disposeCards();
                counterStore.setPlayerNumber([]);
            }, 2000)
        }

    }, [counterStore.gameState?.gameOver])



    function createGameWithTokens()
    {
        createAllInstances(sceneState, 0);
        createAllInstances(sceneState, 1);
        createAllInstances(sceneState, 2);
        createNewGame(sceneState, counterStore, setGameOVer, setBetting, setGameStart)


        setTimeout(() =>
        {
            counterStore._prevTokentsFromHand = [...counterStore.tokentsFromHand];
            hit(sceneState, counterStore)
        }, 4000)
    }


    useEffect(() =>
    {
        if (counterStore.gameState?.gameOver === true)
        {
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


    useEffect(() =>
    {
        const alltrue = loaded.every(value => value === true)

        if (alltrue)
        {
            setLoadingScreen(false)

        }


    }, [loaded])



    function repeat()
    {
        const numDivs = counterStore.tokentsFromHand

        for (let i = 1; i < numDivs.length + 1; i++)
        {
            counterStore.setPlayerHands(i);
            counterStore.setTokensChangeOnWinOrLoss(i);
        }


        counterStore._tokentsFromHand = [...counterStore._prevTokentsFromHand];
        setRefresh(!refreesh)

    }

    const numDivs = counterStore._prevTokentsFromHand
    const sumOfTokens = numDivs.reduce((accumulator, currentValue) =>
    {
        return accumulator + currentValue;
    }, 0);



    return (



        <div style={{ position: 'relative', display: "flex" }}>
            <div
                style={{
                    position: "fixed",
                    zIndex: 9999,
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,1)",
                    color: "white",
                    opacity: loadingScreen ? 1 : 0,
                    transition: "opacity 3s ease-out",
                    pointerEvents: !loadingScreen ? "none" : "auto",
                }}
            >
                LOADING .....
            </div>

            <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />


            <div className={`overlay ${gameStarted ? 'fadeOut' : ''}`}>



                {counterStore.gameState?.hands && <Navbar></Navbar>}

                {!gameOver && (
                    <div className='margin' style={!gameOver ? mountedStyle : unmountedStyle}>
                        {gameStarted && counterStore.tokentsFromHand[0] | counterStore.tokentsFromHand[1] | counterStore.tokentsFromHand[2] ? <button className="glow" onClick={createGameWithTokens}>Start Game</button> : null}
                        {!gameStarted && <a className='again' onClick={tableSet}><span className='againSpan'></span>Start</a>}


                    </div>
                )}
                {gameOver && counterStore.tokensChangeOnWinOrLoss ?
                    <div className="game-buttons" style={counterStore.tokensChangeOnWinOrLoss ? mountedStyle : unmountedStyle}>

                        <Hit props={sceneState} state={setGameStart}></Hit>
                    </div> : null
                }

                {betting && <div>

                    <div className="bar chipSelector" style={{ margin: "2rem" }}>
                        <ChipSelector handleClick={handleClick} lastClicked={lastClicked}></ChipSelector>
                        {sumOfTokens ? <button

                            onClick={repeat}
                            className="repeat"

                        >
                            <img style={{ height: "90%", width: "100%" }} src={repeatIcon} alt="camera" />
                        </button> : null}



                    </div>


                    <HandSpots chips={chip} state={setGamePhase} phase={gamePhase} scene={sceneState}></HandSpots>

                </div>}

                <div className="tokens">

                    {!board && <Statistics setBoard={setBoard} board={board}></Statistics>}
                </div>

            </div>

        </div>


    );
}