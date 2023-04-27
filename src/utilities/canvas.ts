import { Vector3, Animation, Scene, SceneLoader, AbstractMesh, Space, Mesh } from "@babylonjs/core";
import { Console } from "console";
import "@babylonjs/loaders";
import { toJS } from "mobx";
import { cards } from "../assets/pngCards";
import { cardInstances, getCards2 } from "../components/canvasUtils/canvasUtils";
import { GameStore } from "../store/store";

export function a()
{


}

const player1 = -0.5;
const dealer = -0.5;
const player2 = 4;
const player3 = -5;

const vectorY1 = -2.63;
const vectorY2 = -2.55;
const vectorY3 = -2.45;

const vectorZ1 = -0.5;
const vectorZ2 = 0.8;
const vectorZ3 = 1;


export async function createNewGame(scene: any, counterStore: GameStore, setGameOVer: (arg0: boolean) => void, setBetting: (arg0: boolean) => void, setGameStart: (arg0: boolean) => void): Promise<void>
{
    await counterStore.createNewGame();

    if (counterStore.gameState != null)
    {

        console.log(toJS(counterStore.gameState))
        setGameOVer(true);
        setBetting(false);

        cardInstances.forEach((instance: any) =>
        {
            instance.dispose();
            instance = null;

        });
        getCards2(counterStore, scene, cards, "dealerHand", 0, player1 + 0.95, vectorY1, vectorY1, 0)


        for (let i = 0; i < counterStore.gameState.hands!.length; i++)
        {
            setTimeout(() =>
            {
                console.log(counterStore.gameState!.hands![i])
                if (counterStore.gameState!.hands![i] === 2)
                {

                    getCards2(counterStore, scene, cards, "playerHands", i, player1 + 0.95, vectorY1, vectorZ1, 0)
                }


                if (counterStore.gameState!.hands![i] === 1)
                {

                    getCards2(counterStore, scene, cards, "playerHands", i, player2 + 0.95, vectorY2, vectorZ2, 2.65)
                }


                if (counterStore.gameState!.hands![i] === 3)
                {

                    getCards2(counterStore, scene, cards, "playerHands", i, player3 + 0.95, vectorY3, vectorZ3, -2.6)
                }


            }, 500 * i)
        }


        setBetting(false);
        setGameStart(true);



    }
}


export function disposeCards()
{
    cardInstances.forEach((instance: any) =>
    {
        instance.dispose();
        instance = null;

    });
}




export async function readyTable(counterStore: GameStore, setGameStarted: (arg0: boolean) => void): Promise<void>
{

    await counterStore.setTable();
    setGameStarted(true)

}



export async function hit(scene: any, counterStore: GameStore): Promise<void>
{


    console.log(counterStore)
    if (counterStore.gameState != null)
    {
        if (!counterStore.gameState?.gameOver)
        {
            await counterStore.hit();
            const newLimit = counterStore._limit

            // console.log(toJS(counterStore._limit))



            // for (let i = 0; i < counterStore.gameState.hands!.length; i++)
            for (let i = 0; i < newLimit.length; i++)
            {

                const a = newLimit[i];

                console.log(newLimit);
                const b = toJS(counterStore.gameState!.hands);

                let index = b!.indexOf(a);
                if (index === -1)
                {

                    index = newLimit[i]
                }


                setTimeout(() =>
                {


                    if (newLimit[i] === 2)
                    {


                        getCards2(counterStore, scene, cards, "playerHands", index, player1 + 0.95, vectorY1, vectorZ1, 0)
                    }

                    if (newLimit[i] === 1)
                    {



                        getCards2(counterStore, scene, cards, "playerHands", index, player2 + 0.95, vectorY2, vectorZ2, 2.6)
                    }

                    if (newLimit[i] === 3)
                    {

                        getCards2(counterStore, scene, cards, "playerHands", index, player3 + 0.95, vectorY3, vectorZ3, -2.6)
                    }


                }, 200 * i)
            }



        }

    }

    // setBetting(false)

    counterStore._limit = [];
}



export async function stand(scene: any, counterStore: GameStore, setGameStart: (arg0: boolean) => void): Promise<void>
{
    if (!counterStore.gameState?.gameOver)
    {


        if (counterStore.gameState != null)


            while (counterStore.gameState.dealerScore < 17)
            {

                await counterStore.stand();

                console.log(counterStore.gameState.dealerScore)
                // getCards2(counterStore, scene, cards, "dealerHand", 0, player1 + 0.95, vectorY1, 0)

                // getCards2(counterStore, scene, cards, "dealerHand")
                // getCards2(counterStore, scene, cards, "dealerHand", 1, player3 + 0.95, vectorY3, -2.6)

            }

        for (let i = 1; i < counterStore.gameState?.dealerHand.length!; i++)
        {

            console.log(counterStore.gameState?.dealerHand.length!)
            console.log(i)


            getCards2(counterStore, scene, cards, "dealerHand", i, player1 + 0.95, vectorY1, vectorZ1, 0)

        }
    }

    // setBetting(false)



    setGameStart(false)
}


export async function addChips(x: number, counterStore: GameStore): Promise<void>
{
    await counterStore.setTokensChangeOnWinOrLoss(x);

}


// export function burn(sceneState: any, cardInstances: any)
// {

//     if (sceneState !== null)
//         setTimeout(() =>
//         {
//             sceneState!.beginAnimation(cardInstances, 0, 30, false);
//             burnCards(cardInstances, sceneState); // Call the burnCards function here
//         }, 500);
// }

export function checkCamera(sceneState: any)
{
    if (sceneState && sceneState.activeCamera)
    {
        // Get the current camera and its position
        const camera = sceneState.activeCamera;
        const prevCameraPosition = camera.position.clone();

        // Create the target position for the camera
        const targetPosition = new Vector3(0, 4, -13);


        // Stop any existing animations on the camera
        camera.animations = [];


        // Create the animation to move the camera from the previous position to the new position
        const animation = new Animation("cameraAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const animationKeys = [];
        animationKeys.push({ frame: 0, value: prevCameraPosition });
        animationKeys.push({ frame: 30, value: targetPosition.clone() });
        animation.setKeys(animationKeys);

        // Add the new animation to the camera's animations array
        camera.animations.push(animation);

        // Start the animation and set the camera's position to the target position in the callback function
        sceneState.beginAnimation(camera, 0, 30, false, undefined, () =>
        {
            camera.position = targetPosition.clone();
        });

    }
}


export function checkCamera3(sceneState: any)
{
    if (sceneState && sceneState.activeCamera)
    {
        // Get the current camera and its position
        const camera = sceneState.activeCamera;
        const prevCameraPosition = camera.position.clone();

        // Create the target position for the camera
        const targetPosition = new Vector3(0, 4, -13);


        // Stop any existing animations on the camera
        camera.animations = [];
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

        sceneState.beginAnimation(camera, 0, numFrames, true);

        // Start the animation and set the camera's position to the target position in the callback function


    }
}



export function checkCamera2(sceneState: any, position: Number)
{
    if (sceneState && sceneState.activeCamera)
    {
        // Get the current camera and its position
        const camera = sceneState.activeCamera;
        const prevCameraPosition = camera.position.clone();

        // Create the target position for the camera
        let targetPosition: any;
        if (position === 1)
        {

            targetPosition = new Vector3(-9, 2.5, -7);
        } else if (position === 2)
        {

            targetPosition = new Vector3(0, 1, -9);
            // targetPosition = new Vector3(0, 2, -8);
        }
        else if (position === 3)
        {

            targetPosition = new Vector3(9, 2.5, -7);
        }


        // Stop any existing animations on the camera
        camera.animations = [];
        // camera.setTarget(new Vector3(0, -10, 12));

        // Create the animation to move the camera from the previous position to the new position
        const animation = new Animation("cameraAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const animationKeys = [];
        animationKeys.push({ frame: 0, value: prevCameraPosition });
        animationKeys.push({ frame: 30, value: targetPosition.clone() });
        animation.setKeys(animationKeys);

        // Add the new animation to the camera's animations array
        camera.animations.push(animation);

        // Start the animation and set the camera's position to the target position in the callback function
        sceneState.beginAnimation(camera, 0, 30, false, undefined, () =>
        {
            camera.position = targetPosition.clone();
        });

    }
}



export function getChipsFromTokens(tokens: number): { ten: number, fifty: number, hung: number, fivehung: number }
{
    let chipObject = { ten: 0, fifty: 0, hung: 0, fivehung: 0 };
    let token = tokens;

    // if (token > 40)
    // {
    //     chipObject.ten = 5;
    //     token = token - 50;
    // }

    // if (token > 40)
    // {

    //     chipObject.fifty = 1;
    //     token = token - 50;

    // }

    // if (token > 90)
    // {
    //     chipObject.hung = 1;
    //     token = token - 100;
    // }


    // console.log(token)

    if (token >= 500)
    {
        chipObject.fivehung = chipObject.fivehung + Math.floor(token / 500);
        token = token - (Math.floor(token / 500) * 500);
        console.log(token)
    }

    if (token >= 100)
    {
        chipObject.hung = chipObject.hung + Math.floor(token / 100);
        token = token - (Math.floor(token / 100) * 100);
        console.log(token)
    }

    if (token >= 50)
    {
        chipObject.fifty = chipObject.fifty + Math.floor(token / 50);
        token = token - (Math.floor(token / 50) * 50);
        console.log(token)
    }
    if (token >= 10)
    {
        chipObject.ten = chipObject.ten + Math.floor(token / 10);
        token = token - (Math.floor(token / 10) * 10);
        console.log(token)
    }



    console.log(chipObject)

    return chipObject;
}



export function createTokensOnTable(scene: Scene)
{


    SceneLoader.ImportMesh("", "./assets/", "ten.glb", scene, (newMeshes: AbstractMesh[]) =>
    {
        const mainObject = newMeshes[0] as Mesh;

        mainObject.rotate(new Vector3(2, 0, 0), Math.PI / 2, Space.WORLD);
        for (let i = 0; i < 30; i++)
        {
            const newInstance = mainObject.clone(`instance_${i}`);
            newInstance.scaling = new Vector3(0.4, 0.4, 0.4);

            if (i < 10)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 6.15;
                newInstance.position.z = 9.5 + i / 5;
            }

            if (i >= 10 && i < 20)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 5.5;
                newInstance.position.z = 7.5 + i / 5;
            }
            else if (i >= 20)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 4.7;
                newInstance.position.z = 5.5 + i / 5;
            }
        }
        mainObject.dispose();
    });



    SceneLoader.ImportMesh("", "./assets/", "fifty.glb", scene, (newMeshes: AbstractMesh[]) =>
    {
        const mainObject = newMeshes[0] as Mesh;

        mainObject.rotate(new Vector3(3, 0, 0), Math.PI / 2, Space.WORLD);
        for (let i = 0; i < 30; i++)
        {
            const newInstance = mainObject.clone(`instance_${i}`);
            newInstance.scaling = new Vector3(0.4, 0.4, 0.4);

            if (i < 10)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 4;
                newInstance.position.z = 9.5 + i / 5;
            }

            if (i >= 10 && i < 20)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 3.3;
                newInstance.position.z = 7.5 + i / 5;
            }
            else if (i >= 20)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 2.5;
                newInstance.position.z = 5.5 + i / 5;
            }
        }
        mainObject.dispose();
    });


    SceneLoader.ImportMesh("", "./assets/", "hung.glb", scene, (newMeshes: AbstractMesh[]) =>
    {
        const mainObject = newMeshes[0] as Mesh;

        mainObject.rotate(new Vector3(Math.PI / 2, 0, 0), Math.PI / 2, Space.WORLD);
        for (let i = 0; i < 20; i++)
        {
            const newInstance = mainObject.clone(`instance_${i}`);
            newInstance.scaling = new Vector3(0.4, 0.4, 0.4);

            if (i < 10)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 2.4;
                newInstance.position.z = 9.5 + i / 5;
            }

            if (i >= 10 && i < 20)
            {

                newInstance.position.y = -0.8;
                newInstance.position.x = 1.6;
                newInstance.position.z = 7.5 + i / 5;
            }

        }
        mainObject.dispose();
    });


    SceneLoader.ImportMesh("", "./assets/", "fivehung.glb", scene, (newMeshes: AbstractMesh[]) =>
    {
        const mainObject = newMeshes[0] as Mesh;

        mainObject.rotate(new Vector3(3, 0, 0), Math.PI / 2, Space.WORLD);
        for (let i = 0; i < 10; i++)
        {
            const newInstance = mainObject.clone(`instance_${i}`);
            newInstance.scaling = new Vector3(0.4, 0.4, 0.4);

            if (i < 10)
            {

                newInstance.position.y = -0.2;
                newInstance.position.x = 0.27;
                newInstance.position.z = 9.5 + i / 5;
            }


        }
        mainObject.dispose();
    });


    SceneLoader.ImportMesh("", "./assets/", "thous.glb", scene, (newMeshes: AbstractMesh[]) =>
    {
        const mainObject = newMeshes[0] as Mesh;

        mainObject.rotate(new Vector3(3, 0, 0), Math.PI / 2, Space.WORLD);
        for (let i = 0; i < 10; i++)
        {
            const newInstance = mainObject.clone(`instance_${i}`);
            newInstance.scaling = new Vector3(0.4, 0.4, 0.4);

            if (i < 10)
            {

                newInstance.position.y = -0.2;
                newInstance.position.x = 0.2;
                newInstance.position.z = 9.5 + i / 5;
            }


        }
        mainObject.dispose();
    });
}