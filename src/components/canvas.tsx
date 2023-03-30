import React, { useRef, useEffect, useContext } from 'react';
import { Engine, Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Texture, ActionManager, ExecuteCodeAction, Mesh } from "babylonjs";
import * as GUI from "babylonjs-gui";
import { cards } from '../assets/pngCards';
import CounterContext, { GameStore } from '../store/store';
import { toJS } from 'mobx';
import { getSuitFromValue } from '../utilities';
import { Card, Rank } from '../types';
import { getCards } from './canvasUtils/canvasUtils';

export default function Canvas() 
{

    const canvasRef = useRef(null);
    const counterStore: GameStore = useContext(CounterContext);


    async function createNewGame(scene: any): Promise<void>
    {
        await counterStore.createNewGame();
        if (counterStore.gameState != null)
        {
            getCards(counterStore, scene, cards, "dealerHand")
            getCards(counterStore, scene, cards, "playerHand")
        }
    }


    async function hit(scene: Scene): Promise<void>
    {
        await counterStore.hit();
        getCards(counterStore, scene, cards, "dealerHand")
        getCards(counterStore, scene, cards, "playerHand")
    }

    useEffect(() =>
    {
        console.log(counterStore)
        if (canvasRef.current)
        {
            const engine = new Engine(canvasRef.current, true);
            const scene: Scene = new Scene(engine);
            // create your Babylon.js scene here

            // add a camera to the scene
            const camera = new FreeCamera("camera", new Vector3(0, 5, -10), scene);
            camera.setTarget(Vector3.Zero());
            camera.attachControl(canvasRef.current, true);
            new HemisphericLight("light", new Vector3(0, 1, 0), scene);


            const table: Mesh = MeshBuilder.CreateBox("table", { width: 16, height: 0.2, depth: 10 }, scene);
            table.position.y = -0.1; // position slightly below ground level
            const tableMaterial = new StandardMaterial("tableMat", scene);
            tableMaterial.diffuseColor = new Color3(0.1, 0.5, 0.1); // set green color
            table.material = tableMaterial;

            //Creates card spot

            const cardSpotBorder1 = MeshBuilder.CreateBox("cardSpotBorder1", { width: 1.25, height: 0.02, depth: 1.25 }, scene);
            cardSpotBorder1.position.set(-1, 0.05, -3.5);
            const cardSpotBorderMaterial1 = new StandardMaterial("cardSpotBorderMat1", scene);
            cardSpotBorderMaterial1.diffuseColor = new Color3(1, 1, 0); // set yellow color
            cardSpotBorder1.material = cardSpotBorderMaterial1;

            const cardSpot1 = MeshBuilder.CreateBox("cardSpot1", { width: 1, height: 0.01, depth: 1 }, scene);
            cardSpot1.position.set(-1, 0.07, -3.5);
            const cardSpotMaterial = new StandardMaterial("cardSpotMat", scene);
            cardSpotMaterial.diffuseColor = new Color3(0.1, 0.5, 0.1); // set green color

            cardSpot1.material = cardSpotMaterial;


            const buttonForStart = GUI.Button.CreateSimpleButton("button", "Show cards");
            buttonForStart.top = "-10%";
            buttonForStart.width = "150px";
            buttonForStart.height = "40px";
            buttonForStart.color = "white";
            buttonForStart.background = "blue";
            buttonForStart.onPointerUpObservable.add(function ()
            {
                createNewGame(scene)
                console.log("Button clicked!");
            });
            const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            // add the button to the GUI
            advancedTexture.addControl(buttonForStart);









            const buttonForStart2 = GUI.Button.CreateSimpleButton("button", "Hit");
            buttonForStart2.top = "-30%";
            buttonForStart2.width = "150px";
            buttonForStart2.height = "40px";
            buttonForStart2.color = "white";
            buttonForStart2.background = "blue";
            buttonForStart2.onPointerUpObservable.add(function ()
            {
                hit(scene)
                console.log("Button clicked!");
            });
            const advancedTexture2 = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            // add the button to the GUI
            advancedTexture2.addControl(buttonForStart2);





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
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    );
}