import { Vector3, Animation, Scene, SceneLoader, AbstractMesh, Space, Mesh } from "@babylonjs/core";
import "@babylonjs/loaders";
import { toJS } from "mobx";
import { cards } from "../assets/pngCards";
import { cardInstances, createInstanceOfCard } from "../components/canvasUtils/canvasUtils";
import { chipPositions, player1, player2, player3, vectorY1, vectorY2, vectorY3, vectorZ1, vectorZ2, vectorZ3 } from "../consts/canvas";
import { GameStore } from "../store/store";

export function a()
{


}



export async function createNewGame(scene: any, counterStore: GameStore, setGameOVer: (arg0: boolean) => void, setBetting: (arg0: boolean) => void, setGameStart: (arg0: boolean) => void): Promise<void>
{
    await counterStore.createNewGame();

    if (counterStore.gameState != null)
    {


        setGameOVer(true);
        setBetting(false);

        cardInstances.forEach((instance: any) =>
        {
            instance.dispose();
            instance = null;

        });
        createInstanceOfCard(counterStore, scene, cards, "dealerHand", 0, player1 + 0.95, vectorY1, vectorY1, 0, 0)


        for (let i = 0; i < counterStore.gameState.hands!.length; i++)
        {


            setTimeout(() =>
            {

                if (counterStore.gameState!.hands![i] === 2)
                {


                    createInstanceOfCard(counterStore, scene, cards, "playerHands", i, player1 + 0.95, vectorY1, vectorZ1, 0, 1)
                }


                if (counterStore.gameState!.hands![i] === 1)
                {



                    createInstanceOfCard(counterStore, scene, cards, "playerHands", i, player2 + 0.95, vectorY2, vectorZ2, 2.65, 1)
                }


                if (counterStore.gameState!.hands![i] === 3)
                {


                    createInstanceOfCard(counterStore, scene, cards, "playerHands", i, player3 + 0.95, vectorY3, vectorZ3, -2.6, 1)

                }


            }, 500 * i)

        }

        for (let i = 0; i < counterStore.gameState.hands!.length; i++)
        {


            setTimeout(() =>
            {

                if (counterStore.gameState!.hands![i] === 2)
                {

                    createInstanceOfCard(counterStore, scene, cards, "playerHands", i, player1 + 0.95, vectorY1, vectorZ1, 0, 0)

                }


                if (counterStore.gameState!.hands![i] === 1)
                {

                    createInstanceOfCard(counterStore, scene, cards, "playerHands", i, player2 + 0.95, vectorY2, vectorZ2, 2.65, 0)


                }


                if (counterStore.gameState!.hands![i] === 3)
                {

                    createInstanceOfCard(counterStore, scene, cards, "playerHands", i, player3 + 0.95, vectorY3, vectorZ3, -2.6, 0)


                }


            }, 1000 * i + 500 * counterStore.gameState!.hands!.length)
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



    if (counterStore.gameState != null)
    {
        if (!counterStore.gameState?.gameOver)
        {
            await counterStore.hit();
            const newLimit = counterStore._limit
            for (let i = 0; i < newLimit.length; i++)
            {

                const a = newLimit[i];


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


                        createInstanceOfCard(counterStore, scene, cards, "playerHands", index, player1 + 0.95, vectorY1, vectorZ1, 0, 0)
                    }

                    if (newLimit[i] === 1)
                    {



                        createInstanceOfCard(counterStore, scene, cards, "playerHands", index, player2 + 0.95, vectorY2, vectorZ2, 2.6, 0)
                    }

                    if (newLimit[i] === 3)
                    {

                        createInstanceOfCard(counterStore, scene, cards, "playerHands", index, player3 + 0.95, vectorY3, vectorZ3, -2.6, 0)
                    }


                }, 200 * i)
            }



        }

    }

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


            }

        for (let i = 1; i < counterStore.gameState?.dealerHand.length!; i++)
        {


            createInstanceOfCard(counterStore, scene, cards, "dealerHand", i, player1 + 0.95, vectorY1, vectorZ1, 0, 0)

        }
    }





    setGameStart(false)
}


export async function addChips(x: number, counterStore: GameStore): Promise<void>
{
    await counterStore.setTokensChangeOnWinOrLoss(x);

}





export function checkCamera(sceneState: any)
{
    if (sceneState && sceneState.activeCamera)
    {

        const camera = sceneState.activeCamera;
        const prevCameraPosition = camera.position.clone();




        let targetPosition: Vector3;



        if (window.innerWidth < 401)
        {

            targetPosition = new Vector3(0, 19, -17);
        }

        else if (window.innerWidth < 768)
        {
            targetPosition = new Vector3(0, 14, -15);
        }

        else if (window.innerWidth >= 768 && window.innerWidth < 1024)
        {
            targetPosition = new Vector3(0, 4, -13);
        }

        else
        {
            targetPosition = new Vector3(0, 4, -13);
        }



        const animation = new Animation("cameraAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const animationKeys = [];
        animationKeys.push({ frame: 0, value: prevCameraPosition });
        animationKeys.push({ frame: 30, value: targetPosition.clone() });
        animation.setKeys(animationKeys);


        camera.animations.push(animation);


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
        const camera = sceneState.activeCamera;
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




    }
}



export function checkCamera2(sceneState: any, position: Number)
{
    if (sceneState && sceneState.activeCamera)
    {

        const camera = sceneState.activeCamera;
        const prevCameraPosition = camera.position.clone();


        let targetPosition: any;
        if (position === 1)
        {

            targetPosition = new Vector3(-9, 2.5, -7);
        } else if (position === 2)
        {

            targetPosition = new Vector3(0, 1, -9);

        }
        else if (position === 3)
        {

            targetPosition = new Vector3(9, 2.5, -7);
        }

        camera.animations = [];

        const animation = new Animation("cameraAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const animationKeys = [];
        animationKeys.push({ frame: 0, value: prevCameraPosition });
        animationKeys.push({ frame: 30, value: targetPosition.clone() });
        animation.setKeys(animationKeys);


        camera.animations.push(animation);

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


    if (token >= 500)
    {
        chipObject.fivehung = chipObject.fivehung + Math.floor(token / 500);
        token = token - (Math.floor(token / 500) * 500);

    }

    if (token >= 100)
    {
        chipObject.hung = chipObject.hung + Math.floor(token / 100);
        token = token - (Math.floor(token / 100) * 100);

    }

    if (token >= 50)
    {
        chipObject.fifty = chipObject.fifty + Math.floor(token / 50);
        token = token - (Math.floor(token / 50) * 50);

    }
    if (token >= 10)
    {
        chipObject.ten = chipObject.ten + Math.floor(token / 10);
        token = token - (Math.floor(token / 10) * 10);

    }





    return chipObject;
}



export function createTokensOnTable(scene: Scene, loaded: boolean[])
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


    loaded[1] = true;
}



export function createChipStacks(tokenNumbers: { [key: string]: number }, index: number, scene: Scene, createInstance: (loaderType: string, modelPath: string, scene: Scene, position?: Vector3 | null, scaling?: Vector3 | null) => void,)
{

    for (const [key, value] of Object.entries(tokenNumbers))
    {


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




export function ChangeCamera(sceneState: any, currentView: number, prevView: number)
{
    if (sceneState && sceneState.activeCamera)
    {
        const camera = sceneState.activeCamera;
        const prevCameraPosition = camera.position.clone();

        let targetPosition: Vector3;

        // determine previous and target camera positions based on the current and previous views


        switch (currentView)
        {
            case 1:
                targetPosition = new Vector3(0, 12, -17);
                break;
            case 2:
                targetPosition = new Vector3(0, 14, -15);
                break;
            case 3:
                targetPosition = new Vector3(0, 4, -17);
                break;
            default:
                targetPosition = new Vector3(0, 4, -13);
                break;
        }


        // create animation
        const animation = new Animation("cameraAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const animationKeys = [];
        animationKeys.push({ frame: 0, value: prevCameraPosition.clone() });
        animationKeys.push({ frame: 30, value: targetPosition.clone() });
        animation.setKeys(animationKeys);

        // add animation to camera
        camera.animations.push(animation);

        // begin animation
        sceneState.beginAnimation(camera, 0, 30, false, undefined, () =>
        {
            camera.position = targetPosition.clone();
        });
    }
}