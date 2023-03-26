import React from 'react'
import { useSpring, animated } from 'react-spring';
//awfull way to import all the cards, but it works for now
import { C2C, CBB, C2D, C10C, C10D, C10H, C10S, C2H, C2S, C3C, C3D, C3H, C3S, C4C, C4D, C4H, C4S, C5C, C5D, C5H, C5S, C6C, C6D, C6H, C6S, C7C, C7D, C7H, C7S, C8C, C8D, C8H, C8S, C9C, C9D, C9H, C9S, CAC, CAD, CAH, CAS, CJC, CJD, CJH, CJS, CKC, CKD, CKH, CKS, CQC, CQD, CQH, CQS } from '../svg'
import { Card, Rank } from '../types';
import { getSuitFromValue } from '../utilities';

export default function SingleCard(card: Card, isDealer: boolean, index: number)
{

    //make it better later on
    const componentsMap: { [key: string]: JSX.Element } = {
        C2C: <C2C />, C2D: <C2D />, C10C: <C10C />, C10D: <C10D />, C10H: <C10H />, C10S: <C10S />, C2H: <C2H />, C2S: <C2S />, C3C: <C3C />, C3D: <C3D />, C3H: <C3H />, C3S: <C3S />, C4C: <C4C />,
        C4D: <C4D />, C4H: <C4H />, C4S: <C4S />, C5C: <C5C />, C5D: <C5D />, C5H: <C5H />, C5S: <C5S />, C6C: <C6C />, C6D: <C6D />, C6H: <C6H />, C6S: <C6S />, C7C: <C7C />, C7D: <C7D />, C7H: <C7H />,
        C7S: <C7S />, C8C: <C8C />, C8D: <C8D />, C8H: <C8H />, C8S: <C8S />, C9C: <C9C />, C9D: <C9D />, C9H: <C9H />, C9S: <C9S />, CAC: <CAC />, CAD: <CAD />, CAH: <CAH />, CAS: <CAS />,
        CJC: <CJC />, CJD: <CJD />, CJH: <CJH />, CJS: <CJS />, CKC: <CKC />, CKD: <CKD />, CKH: <CKH />, CKS: <CKS />, CQC: <CQC />, CQD: <CQD />, CQH: <CQH />, CQS: <CQS />, CBB: <CBB />
    };

    const modifiedCard = cardCheck(card);
    console.log(modifiedCard);
    const CardComponent = componentsMap[modifiedCard];

    function cardCheck(card: Card): string
    {

        console.log(card)

        const suit = getSuitFromValue(card.suit);
        console.log("suit", suit)
        if (card.rank < 9)
        {
            return `C${card.rank + 2}${suit}`
        }

        else { return `C${Rank[card.rank]}${suit}` }

    }

    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1000 },
    });




    return <animated.span style={fadeIn}>{CardComponent}</animated.span>;
}
