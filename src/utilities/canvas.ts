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





export function getChipsFromTokens(tokens: number): { ten: number, fifty: number, hung: number, fivehung: number }
{
    let chipObject = { ten: 0, fifty: 0, hung: 0, fivehung: 0 };
    let token = tokens;

    if (token > 40)
    {
        chipObject.ten = 5;
        token = token - 50;
    }

    if (token > 40)
    {

        chipObject.fifty = 1;
        token = token - 50;

    }

    if (token > 90)
    {
        chipObject.hung = 1;
        token = token - 100;
    }


    console.log(token)

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


