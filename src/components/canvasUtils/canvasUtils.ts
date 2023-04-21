import { MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Animation, AnimationGroup, EasingFunction, Material, Mesh, ParticleSystem, Color4 } from "babylonjs";
import { toJS } from "mobx";
import { GameStore } from "../../store/store";
import { Card, Rank } from "../../types";
import { getSuitFromValue } from "../../utilities";




export const cardInstances: any = [];


export function getCards2(counterStore: GameStore, scene: Scene, cards: { [key: string]: string }, who: "playerHands" | "dealerHand", index: number, Xvector: number, Yvector: number, skew: number)
{
    const cardMesh = MeshBuilder.CreatePlane("card", { width: 2.5, height: 4.3 }, scene);
    cardMesh.position.y = 0.72;
    cardMesh.scaling = new Vector3(0.7, 0.7, 0.7);

    if (counterStore.gameState !== null)
    {



        const handLength = counterStore.gameState[who][index].length;
        // let newCard: Card;

        // if (who === "playerHands")
        // {

        //     newCard = counterStore.gameState[who][index][handLength - 1];
        // }

        // else
        // {

        //     newCard = counterStore.gameState[who][index]
        // }


        const newCard: Card = counterStore.gameState[who][index][handLength - 1];
        const rank = newCard.rank;

        const suit = getSuitFromValue(newCard.suit);
        const cardMaterial = new StandardMaterial("cardMat", scene);
        cardMaterial.backFaceCulling = false;



        // create a mesh and apply the material to it


        if (newCard.rank < 9)
        {
            cardMaterial.diffuseTexture = new Texture(cards[`${newCard.rank + 2}-${suit}`], scene);
        } else
        {
            cardMaterial.diffuseTexture = new Texture(cards[`${Rank[newCard.rank]}-${suit}`], scene);
        }

        const cardInstance = cardMesh.clone(`card-${handLength - 1}-${who}`)


        cardInstance.material = cardMaterial;
        const startPosition = new Vector3(-5, -2, 9);
        const midPossition = new Vector3(-4, 0, 4);

        if (who === "dealerHand")
        {
            cardInstance.position.y = 0.05;
            cardInstance.position.x = 22;
        } else
        {
            cardInstance.position.y = 0.12;
            cardInstance.position.z = -3.5;
            cardInstance.position.x = 22;

        }

        cardInstance.position.copyFrom(startPosition);

        cardInstance.rotation = new Vector3(Math.PI / -2, 0, 0);

        const endPosition = new Vector3(22, cardInstance.position.y, cardInstance.position.z);
        cardInstance.position.copyFrom(startPosition);
        cardInstance.rotation = new Vector3(Math.PI / -2, 0, 0);
        cardInstances.push(cardInstance)
        const positionAnimation = new Animation("positionAnimation", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);

        const keys = [
            { frame: 0, value: startPosition },
            { frame: 15, value: midPossition },
            // { frame: 30, value: new Vector3(handLength / 3 - vector, - 2.55, -0.4) },
            { frame: 30, value: new Vector3(handLength / 3 - Xvector, Yvector + handLength / 1000, -0.4) },

            // { frame: 30, value: new Vector3(handLength / 3 - 0.45, -2.55, -0.4) },
        ];


        const keys2 = [
            { frame: 0, value: startPosition },
            { frame: 15, value: midPossition },

            { frame: 30, value: new Vector3(handLength / 22 - 2, -2.3, 5) },
        ];

        if (who === "dealerHand")
        {
            positionAnimation.setKeys(keys2);
        } else
        {
            positionAnimation.setKeys(keys);
        }



        const flipAnimation3 = new Animation("flipAnimation", "rotation.z", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

        const flipKeys3 = [
            { frame: 0, value: 0 },
            { frame: 30, value: skew },
        ];


        cardInstance.animations.push(positionAnimation);

        // Define the flip animation
        const flipAnimation = new Animation("flipAnimation", "rotation.x", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const flipAnimation2 = new Animation("flipAnimation", "rotation.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);

        const flipKeys = [
            { frame: 0, value: Math.PI / -2 },
            { frame: 10, value: 0 },
            { frame: 30, value: Math.PI / 2 },
        ];

        const flipKeys2 = [
            { frame: 0, value: Math.PI / 2 },
            { frame: 10, value: 0 },
            { frame: 30, value: Math.PI },
        ];

        flipAnimation.setKeys(flipKeys);

        flipAnimation2.setKeys(flipKeys2);
        flipAnimation3.setKeys(flipKeys3);

        cardInstance.animations.push(flipAnimation);
        cardInstance.animations.push(flipAnimation2);
        cardInstance.animations.push(flipAnimation3);


        setTimeout(() =>
        {
            scene.beginAnimation(cardInstance, 0, 30, false);
        }, 500);


    }

    cardMesh.dispose();
}
