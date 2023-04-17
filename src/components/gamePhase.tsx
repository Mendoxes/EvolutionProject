import React, { useContext, useState } from 'react'
import CounterContext, { GameStore } from '../store/store';

export default function GamePhase()
{
    const counterStore: GameStore = useContext(CounterContext);
    const [betting, setBetting] = useState(false);
    const [table, setTable] = useState(false);
    const [startGame, setStartGame] = useState(false);
    const [gamePhase, setGamePhase] = useState(false);

    const handleTableReadyClick = () =>
    {
        setTable(true);
        setBetting(true);
    }

    const handleBettingClick = () =>
    {
        setBetting(false);
        setStartGame(true);
    }

    const handleStartGameClick = () =>
    {
        setStartGame(false);
        setGamePhase(true);
    }

    return (
        <div style={{ margin: "220px", zIndex: "2" }}>

            {!table && (
                <div>
                    Tableready
                    <button onClick={handleTableReadyClick}>Start Betting</button>
                </div>
            )}
            {betting && (
                <div>
                    Betting Phase
                    <button onClick={handleBettingClick}>Start Game</button>
                </div>
            )}
            {startGame && (
                <div>
                    Game Started
                    <button onClick={handleStartGameClick}>Hit/Stand</button>
                </div>
            )}
            {gamePhase && <div>Hit/Stand</div>}
        </div>
    )
}