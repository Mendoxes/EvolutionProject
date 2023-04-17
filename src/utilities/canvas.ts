import { toJS } from "mobx";
import { cards } from "../assets/pngCards";
import { cardInstances, getCards2 } from "../components/canvasUtils/canvasUtils";
import { GameStore } from "../store/store";

export function a()
{


}

const player1 = -0.5;
const player2 = 3.5;
const player3 = -4.5;

const vectorY1 = -2.55
const vectorY2 = -2
const vectorY3 = -1.85


export async function createNewGame(scene: any, counterStore: GameStore, setGameOVer: (arg0: boolean) => void, setBetting: (arg0: boolean) => void,): Promise<void>
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


        for (let i = 0; i < counterStore.gameState.hands!.length; i++)
        {
            setTimeout(() =>
            {
                console.log(counterStore.gameState!.hands![i])
                if (counterStore.gameState!.hands![i] === 1)
                {

                    getCards2(counterStore, scene, cards, "playerHands", i, player1 + 0.95, vectorY1, 0)
                }


                if (counterStore.gameState!.hands![i] === 2)
                {

                    getCards2(counterStore, scene, cards, "playerHands", i, player2 + 0.95, vectorY2, 2.6)
                }


                if (counterStore.gameState!.hands![i] === 3)
                {

                    getCards2(counterStore, scene, cards, "playerHands", i, player3 + 0.95, vectorY3, -2.6)
                }


            }, 500 * i)
        }





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

export async function hit(scene: any, counterStore: GameStore, setBetting: (arg0: boolean) => void,): Promise<void>
{


    console.log(counterStore)
    if (counterStore.gameState != null)
    {
        if (!counterStore.gameState?.gameOver)
        {
            await counterStore.hit();

            // console.log(toJS(counterStore._limit))

            // for (let i = 0; i < counterStore.gameState.hands!.length; i++)
            for (let i = 0; i < counterStore._limit.length; i++)
            {
                setTimeout(() =>
                {
                    console.log(counterStore.gameState!.hands![i])
                    console.log(toJS(counterStore._limit[i]))

                    if (counterStore._limit[i] === 1)
                    {

                        getCards2(counterStore, scene, cards, "playerHands", i, player1 + 0.95, vectorY1, 0)
                    }

                    if (counterStore._limit[i] === 2)
                    {

                        getCards2(counterStore, scene, cards, "playerHands", i, player2 + 0.95, vectorY2, 2.6)
                    }

                    if (counterStore._limit[i] === 3)
                    {

                        getCards2(counterStore, scene, cards, "playerHands", i, player3 + 0.95, vectorY3, -2.6)
                    }


                }, 200 * i)
            }



        }
    }

    setBetting(false)
}



export async function stand(scene: any, counterStore: GameStore, setBetting: (arg0: boolean) => void,): Promise<void>
{
    if (!counterStore.gameState?.gameOver)
    {


        if (counterStore.gameState != null)

            while (counterStore.gameState.dealerScore < 17)
            {
                await counterStore.stand();

                console.log(counterStore.gameState.dealerScore)

                // getCards2(counterStore, scene, cards, "dealerHand")

            }
    }

    setBetting(false)
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


