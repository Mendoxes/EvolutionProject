import { MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { GameStore } from "../../store/store";
import { Card, Rank } from "../../types";
import { getSuitFromValue } from "../../utilities";

export function getCards(counterStore: GameStore, scene: Scene, cards: { [key: string]: string }, who: "playerHand" | "dealerHand")
{

    // if (disposePrevCards) {
    //     // dispose of previously created cards
    //     const prevCards = scene.getMeshes().filter(mesh => mesh.name === "card");
    //     prevCards.forEach(mesh => mesh.dispose());
    //   }
    if (counterStore.gameState !== null)
        for (let i = 0; i < counterStore.gameState[who].length; i++)
        {

            const singleCard = counterStore.gameState[who][i];
            const rank = singleCard.rank;
            console.log(rank)

            const cardTranslate = cardCheck(singleCard)
            let cardTexture = new Texture(cards[cardTranslate], scene);
            let card = MeshBuilder.CreatePlane("card", { width: 1, height: 1.5 }, scene);
            if (who === "dealerHand")
            {
                card.position.y = 0.05;
                card.position.x = i - 1;
            } else
            {
                card.position.y = 0.12;
                card.position.z = -3.5;
                card.position.x = i - 1;
            }
            card.rotate(new Vector3(1, 0, 0), Math.PI / 2);
            let cardMaterial = new StandardMaterial("cardMat", scene);
            cardMaterial.diffuseTexture = cardTexture;
            card.material = cardMaterial;
        }

}

function cardCheck(singleCard: Card): string
{

    const suit = getSuitFromValue(singleCard.suit);
    console.log("suit", suit)
    if (singleCard.rank < 9)
    {
        return `${singleCard.rank + 2}-${suit}`
    }

    else { return `${Rank[singleCard.rank]}-${suit}` }

}