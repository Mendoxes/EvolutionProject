import { cards } from "../assets/pngCards";
import { cardInstances, getCards2 } from "../components/canvasUtils/canvasUtils";
import { GameStore } from "../store/store";

export function a()
{


}

export async function createNewGame(scene: any, counterStore: GameStore, setGameOVer: (arg0: boolean) => void,): Promise<void>
{
    await counterStore.createNewGame();
    if (counterStore.gameState != null)
    {
        setGameOVer(true);

        cardInstances.forEach((instance: any) =>
        {
            instance.dispose();
            instance = null;

        });

        getCards2(counterStore, scene, cards, "dealerHand")
        getCards2(counterStore, scene, cards, "playerHand")



    }
}


export async function hit(scene: any, counterStore: GameStore): Promise<void>
{
    if (counterStore.gameState != null)
    {
        if (!counterStore.gameState?.gameOver)
        {
            await counterStore.hit();
            // getCards2(counterStore, scene, cards, "dealerHand")
            getCards2(counterStore, scene, cards, "playerHand")
        }
    }
}



export async function stand(scene: any, counterStore: GameStore): Promise<void>
{
    if (!counterStore.gameState?.gameOver)
    {

        if (counterStore.gameState != null)

            while (counterStore.gameState.dealerScore < 17)
            {
                await counterStore.stand();
                // getCards2(counterStore, scene, cards, "dealerHand")
                getCards2(counterStore, scene, cards, "dealerHand")

            }
    }
}


export async function addChips(x: number, counterStore: GameStore): Promise<void>
{
    await counterStore.setTokensChangeOnWinOrLoss(counterStore.tokensChangeOnWinOrLoss + x);

}


export function getChipsFromTokens(tokens: number): { one: number, two: number, three: number, four: number }
{
    let chipObject = { one: 0, two: 0, three: 0, four: 0 };

    chipObject.four = Math.floor(tokens / 500);
    tokens = tokens % 500;

    chipObject.three = Math.floor(tokens / 100);
    tokens = tokens % 100;

    chipObject.two = Math.floor(tokens / 50);
    tokens = tokens % 50;

    chipObject.one = Math.floor(tokens / 10);

    return chipObject;
}