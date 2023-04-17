import React, { useRef, useEffect, useContext, useState } from 'react';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Texture, ActionManager, ExecuteCodeAction, Mesh, DynamicTexture, FollowCamera, SceneLoader, Space, CubeTexture, PointLight, DirectionalLight, SpotLight, Animation } from "@babylonjs/core"
// import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders";
import { AbstractMesh } from "babylonjs"
import * as GUI from "babylonjs-gui";
import { cards } from '../assets/pngCards';
import CounterContext, { GameStore } from '../store/store';
import '../App.css'
import { createNewGame, getChipsFromTokens, hit, stand } from '../utilities/canvas';


let originalMesh: any = null;
let clonedMeshes: any = [];

export default function Canvas() 
{
    const canvasRef = useRef(null);
    const counterStore: GameStore = useContext(CounterContext);
    const [sceneState, setScene] = useState<Scene | null>(null);
    const [gameOver, setGameOVer] = useState(false);

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
        console.log("click");
        console.log(clonedMeshesRef.current);
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

            console.log(clonedMeshesRef.current.length);
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
            console.log("newMeshes", newMeshes);
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
            console.log(instances);
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
            console.log(value)
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



    async function addChips(x: number): Promise<void>
    {

        await counterStore.setTokensChangeOnWinOrLoss(counterStore.tokensChangeOnWinOrLoss + x);
        createAllInstances(sceneState);


    }


    useEffect(() =>
    {

        console.log(counterStore)
        if (canvasRef.current)
        {
            const engine = new Engine(canvasRef.current);
            const scene: Scene = new Scene(engine);
            setScene(scene);
            new HemisphericLight("light", new Vector3(0, 1, 0), scene);
            const camera = new FreeCamera("camera", new Vector3(0, 7, -18), scene);
            // camera.radius = 20; // distance from the target
            // camera.heightOffset = 500; // height above the target
            camera.setTarget(Vector3.Zero());
            camera.attachControl(canvasRef.current);


            SceneLoader.ImportMesh("", "./", "tabel7.glb", scene, (newMeshes) =>
            {
                console.log("newMeshes", newMeshes)

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




    return (
        <div style={{ position: 'relative' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            <div className={`overlay ${gameOver ? 'fadeOut' : ''}`}>
                <h1>Blackjack Game</h1>
                {!gameOver && (
                    <div className="start-button">
                        <button onClick={() => createNewGame(sceneState, counterStore, setGameOVer)}>Start Game</button>
                    </div>
                )}
                {gameOver && (
                    <div className="game-buttons">
                        <button onClick={() => hit(sceneState, counterStore)} className="hit-button">Hit</button>
                        <button onClick={() => stand(sceneState, counterStore)} className="stand-button">Stand</button>
                    </div>
                )}
                <div className="navbar">
                    {/* <div onClick={() => getChips(counterStore.gameState?.tokens)} className="navbar-button">5</div> */}
                    <div onClick={() => createInstance("ten", "ten.glb", sceneState, new Vector3(0, 0, -7), new Vector3(0.2, 0.2, 0.2))} className="navbar-button"></div>
                    <div onClick={() => removeInstance("ten", 0)} className="navbar-button"></div>
                    <div onClick={() => createInstance("fifty", "fifty.glb", sceneState, new Vector3(2, 0, -7), new Vector3(0.2, 0.2, 0.2))} className="navbar-button"></div>
                    <div onClick={() => removeInstance("fifty", 0)} className="navbar-button"></div>
                    {/* <div onClick={() => createAllInstances(tokenNumbers, sceneState)} className="navbar-button"></div> */}
                    <div onClick={() => createAllInstances(sceneState)} className="navbar-button"></div>
                    <div onClick={() => addChips(10)} className="navbar-button">10</div>
                    <div onClick={() => addChips(50)} className="navbar-button">50</div>
                    <div onClick={() => addChips(100)} className="navbar-button">100</div>
                    <div onClick={() => addChips(500)} className="navbar-button">500</div>
                </div>
                <div className="tokens">
                    <p> Tokens: {counterStore.gameState?.tokens}</p>
                    <button onClick={() => addClone(0.1)}>Add clone</button>
                    <button onClick={removeClone}>remove clone</button>
                </div>
            </div>
        </div>


    );
}