import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react'
import CounterContext, { GameStore } from "../store/store";
import { toJS } from 'mobx';
import { Rank } from '../types';
//awfull way to import all the cards, but it works for now
import {C2C,C2D,C10C,C10D,C10H,C10S,C2H,C2S,C3C,C3D,C3H,C3S,C4C,C4D,C4H,C4S,C5C,C5D,C5H,C5S,C6C,C6D,C6H,C6S,C7C,C7D,C7H,C7S,C8C,C8D,C8H,C8S,C9C,C9D,C9H,C9S,CAC,CAD,CAH,CAS,CBB,CJC,CJD,CJH,CJS,CKC,CKD,CKH,CKS,CQC,CQD,CQH,CQS} from '../svg'



export default function Card():JSX.Element {
  // const [dealerCard,setDealerCard] = useState<string[]>([]);
  const [dealerCard,setDealerCard] = useState<string>("");
  const [playerCard,setPlayerCard] = useState<string>("");
  const componentsMap: { [key: string]: JSX.Element } = {
    C2C: <C2C />,    C2D: <C2D />,    C10C: <C10C />,    C10D: <C10D />,    C10H: <C10H />,    C10S: <C10S />,    C2H: <C2H />,    C2S: <C2S />,    C3C: <C3C />,    C3D: <C3D />,    C3H: <C3H />,    C3S: <C3S />,    C4C: <C4C />,
    C4D: <C4D />,    C4H: <C4H />,    C4S: <C4S />,    C5C: <C5C />,    C5D: <C5D />,    C5H: <C5H />,    C5S: <C5S />,    C6C: <C6C />,    C6D: <C6D />,    C6H: <C6H />,    C6S: <C6S />,    C7C: <C7C />,    C7D: <C7D />,    C7H: <C7H />,
    C7S: <C7S />,    C8C: <C8C />,    C8D: <C8D />,    C8H: <C8H />,    C8S: <C8S />,    C9C: <C9C />,    C9D: <C9D />,    C9H: <C9H />,    C9S: <C9S />,    CAC: <CAC />,    CAD: <CAD />,    CAH: <CAH />,    CAS: <CAS />,    CBB: <CBB />,
    CJC: <CJC />,    CJD: <CJD />,    CJH: <CJH />,    CJS: <CJS />,    CKC: <CKC />,    CKD: <CKD />,    CKH: <CKH />,    CKS: <CKS />,    CQC: <CQC />,    CQD: <CQD />,    CQH: <CQH />,    CQS: <CQS />,  };





    const counterStore: GameStore = useContext(CounterContext);

    const Counter:(() => JSX.Element) = observer(() => {
     

      //!Important - redoo this from the ground - it works but it cannot be the way to do it, it is too messy and not scalable at all  
       async function createNewGame(): Promise<void> {
        await counterStore.createNewGame();
        if (counterStore.gameState != null) {
          let suit = "C"
          let suitPlayer = "C"
          if(toJS(counterStore.gameState.dealerHand[0].suit) === 0){
            suit = "C"}
            else if(toJS(counterStore.gameState.dealerHand[0].suit) === 1){
              suit = "D"}
              else if(toJS(counterStore.gameState.dealerHand[0].suit) === 2){
                suit = "H"}
                else if(toJS(counterStore.gameState.dealerHand[0].suit) === 3){
                  suit = "S"}



                  if(toJS(counterStore.gameState.playerHand[0].suit) === 0){
                    suitPlayer = "C"}
                    else if(toJS(counterStore.gameState.playerHand[0].suit) === 1){
                      suitPlayer = "D"}
                      else if(toJS(counterStore.gameState.playerHand[0].suit) === 2){
                        suitPlayer = "H"}
                        else if(toJS(counterStore.gameState.playerHand[0].suit) === 3){
                          suitPlayer = "S"}

          if (toJS(counterStore.gameState.dealerHand[0].rank) < 9) {

            setDealerCard(`C${toJS(counterStore.gameState!.dealerHand[0].rank+2)}${suit}`)
     

            // setDealerCard(prev => [...prev, `C${toJS(counterStore.gameState!.dealerHand[0].rank+2)}C`])
            console.log(`C${toJS(counterStore.gameState.dealerHand[0].rank+2)}C`);
          } else {
            setDealerCard(`C${Rank[toJS(counterStore.gameState.dealerHand[0].rank)]}${suit}`)

            console.log(`C${Rank[toJS(counterStore.gameState.dealerHand[0].rank)]}C`);
          }
          if (toJS(counterStore.gameState.playerHand[0].rank) < 9) {
            setPlayerCard(`C${toJS(counterStore.gameState!.playerHand[0].rank+2)}${suitPlayer}`)

          }

          else{
            setPlayerCard(`C${Rank[toJS(counterStore.gameState.playerHand[0].rank)]}${suitPlayer}`)

          }



        }
      }
    


console.log(dealerCard)

// useEffect(() => {

// componentsMap[dealerCard[0]]
// }, [dealerCard]);


//delete after no longer needed
function check(){
if(counterStore.gameState != null){
  console.log(toJS(counterStore.gameState.dealerScore))}
}
//delete after no longer needed

        return (
          <div>
            {counterStore.gameState != null && (
            <div>
     
            
            <div>{toJS(counterStore.gameState.dealerScore)}</div>
            <div>{Rank[toJS(counterStore.gameState.dealerHand[0].rank)]}</div>
            <div>{toJS(counterStore.gameState.dealerHand[0].rank)}</div>

            {/* {componentsMap[dealerCard[0]]} */}
            Dealer Card:
            {componentsMap[dealerCard]}
            player card:
            {componentsMap[playerCard]}
            </div>
            )}
 
            <div><button onClick={createNewGame}>Create new Game</button></div>
            <div><button onClick={check}>Check for game to exist</button></div>
          </div>
        );
      });


  return (
    <div>
    <div>
    </div>
<Counter />

    </div>
  )
}
