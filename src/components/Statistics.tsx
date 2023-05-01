import { useContext, useEffect, useState } from "react";
import CounterContext, { GameStore } from "../store/store";

export const Statistics = (props: any) =>
{
    const counterStore: GameStore = useContext(CounterContext);
    const [state, setState] = useState(10)

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            setState((prevState) => prevState - 1);
        }, 1000);

        if (state === 0)
        {
            props.setBoard(true);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [state]);

    if (!counterStore.gameState?.gameOver)
    {
        return null;
    }

    const winners = counterStore.gameState.winner || [];
    const hands = counterStore.gameState.hands || [];
    const dealerWon = winners.length === 0 && winners[0] === "dealer";
    const score = counterStore._prevTokentsFromHand;


    const indexMap: any = {};
    hands.forEach((hand, index) =>
    {
        indexMap[hand - 1] = index;
    });


    return (
        <div
            style={{
                backgroundColor: "black",
                color: "white",
                width: "100vw",
                height: "100vh",
                opacity: 0.8,
                position: "fixed",
                top: 0,
                left: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {!dealerWon ? (
                <div className='scoreboard'>

                    <div className="container">
                        <h2 className="subtitle"> Dealer Score: {counterStore.gameState.dealerScore}</h2>

                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Result</th>

                                <th>Score</th>
                                <th>Tokens</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hands.map((hand, index) =>
                            {

                                const player = hand - 1;
                                const winnerIndex = indexMap[player];
                                const won = (winners as number[]).includes(winnerIndex);
                                const color = won ? "green" : "red";
                                const check = won ? "✔" : "✘";
                                const text = won ? "won" : "lost";
                                const token = won ? "+" : "-";

                                console.log(winners + "winners")
                                console.log(hands + "hands")
                                console.log(hand + "hand")
                                console.log(player + "player")
                                console.log(won + "won")
                                return (
                                    <tr key={index} style={{ color: "white" }}>
                                        <td>Player {hand}</td>
                                        <td style={{ color }}>
                                            {check}
                                        </td>

                                        <td>  ({counterStore.gameState?.playerScores![index]})</td>
                                        <td style={{ color }}>
                                            {token}{score[hand - 1]}

                                        </td>


                                    </tr>

                                );
                            })}


                        </tbody>
                    </table>
                    <div style={{ margin: "1rem" }}>Next game will begin in: {state} seconds</div>

                    <div className="range" data-value={100 - state * 10}>
                        <div className="range__label"></div>
                    </div>
                    <div>
                        <button className='mysterious-button' onClick={() => props.setBoard(!props.board)}> reset</button></div>
                </div>
            ) : (
                <p>Dealer won</p>
            )}
        </div>
    );
};