
import React, { useContext } from 'react';
import CounterContext, { GameStore } from '../store/store';

function Navbar()
{
    const counterStore: GameStore = useContext(CounterContext);
    const numDivs = counterStore.gameState!.hands!.length;

    const renderHands = () =>
    {
        const hands = [];
        for (let i = 0; i < numDivs; i++)
        {
            hands.push(
                <div className="hand" key={i}>
                    <span className="standActive">Hand {i + 1} Score: {counterStore.gameState?.playerScores![i]}</span>

                </div>
            );
        }
        return hands;
    };

    const renderDealerScore = () =>
    {
        if (counterStore.gameState?.dealerScore)
        {
            return (
                <div className="dealer-score">
                    <span>Dealer Score: {counterStore.gameState?.dealerScore}</span>
                </div>
            );
        }
        return null;
    };

    const renderTokens = () =>
    {
        const { tokens, bet } = counterStore.gameState!;
        return (
            <div className="tokens">
                <span>Tokens: {tokens} </span>
                <span className="bet">({bet})</span>
            </div>
        );
    };

    return (
        <nav className="navbar">
            <div className="navbar-section">
                {renderHands()}
            </div>
            <div className="navbar-section">
                {renderDealerScore()}
            </div>
            <div className="navbar-section">
                {renderTokens()}
            </div>
        </nav>
    );
}

export default Navbar;