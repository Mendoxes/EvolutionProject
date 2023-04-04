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


    // function getChips(tokens: number | undefined)
    // {

    //     if (!tokens) return;
    //     const chips = getChipsFromTokens(tokens);
    //     for (let i = 0; i < chips; i++)
    //     {
    //         setTimeout(() => { addClone(0.1) }, 100 * i);

    //     }

    // }


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

                SceneLoader.ImportMesh("", "./assets/", "ten.glb", scene, (newMeshes) =>
                {
                    console.log("newMeshes", newMeshes);
                    newMeshes[1].scaling = new Vector3(0.4, 0.4, 0.4);
                    newMeshes[1].position = new Vector3(0, -3.3, -0.4);
                    originalMeshRef.current = newMeshes[1];
                    const clone = originalMeshRef.current.clone(
                        `clone_${clonedMeshesRef.current.length}`,
                        null,
                        true
                    );
                    clone.position.y += clonedMeshesRef.current.length * 2;
                    clonedMeshesRef.current.push(clone);

                })


                // SceneLoader.ImportMesh("", "./assets/", "fifty.glb", scene, (newMeshes) =>
                // {
                //     console.log("newMeshes", newMeshes);
                //     newMeshes[1].scaling = new Vector3(0.4, 0.4, 0.4);
                //     newMeshes[1].position = new Vector3(0, -3.3, -0.4);
                //     originalMeshRef.current = newMeshes[1];
                //     const clone = originalMeshRef.current.clone(
                //         `clone_${clonedMeshesRef.current.length}`,
                //         null,
                //         true
                //     );
                //     clone.position.y += clonedMeshesRef.current.length * 2;
                //     clonedMeshesRef.current.push(clone);

                // }



                // );

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
                    <div className="navbar-button"></div>
                    <div className="navbar-button"></div>
                    <div className="navbar-button"></div>
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