import React from 'react'

export default function ChipSelector(props: any)
{


    console.log()
    return (
        <>
            <button
                id='ten'
                onClick={() => props.handleClick('ten', 10)}
                className="betting-Chip"
                style={{ transform: props.lastClicked === "ten" ? 'scale(1.2)' : "scale(1)", boxShadow: props.lastClicked === 'ten' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
            >
                10
            </button>
            <button
                id='fifty'
                onClick={() => props.handleClick('fifty', 50)}
                className="betting-Chip"
                style={{ scale: props.lastClicked === "fifty" ? '1.2' : "1", boxShadow: props.lastClicked === 'fifty' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
            >
                50
            </button>
            <button
                id='hundred'
                onClick={() => props.handleClick('hundred', 100)}
                className="betting-Chip"
                style={{ scale: props.lastClicked === "hundred" ? '1.2' : "1", boxShadow: props.lastClicked === 'hundred' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
            >
                100
            </button>
            <button
                id='fivehundred'
                onClick={() => props.handleClick('fivehundred', 500)}
                className="betting-Chip"
                style={{ scale: props.lastClicked === "fivehundred" ? '1.2' : "1", boxShadow: props.lastClicked === 'fivehundred' ? '0px 0px 10px rgba(255, 255, 255, 0.5), 0px 0px 20px rgba(255, 255, 255, 0.3), 0px 0px 30px rgba(255, 255, 255, 0.2), 0px 0px 40px rgba(255, 255, 255, 0.1)' : 'none' }}
            >
                500                </button>
        </>
    )
}
