import React from 'react';
import {useLocation} from 'react-router-dom';
import './Pages.css'

const GameOver = () => {
    const location = useLocation();
    return (
        <div className="game-over-container">
            <div className = "leaderboard-container">
                <p className="heading">Game Over</p>
                <div className = "text">
                    <p>{location.state ? `Your Score: ${location.state.score}`: `Can't Access Score`}</p>
                    <p>{location.state ? `Your High Score: ${location.state.score}`: `Can't Access Score`}</p>
                </div>
            </div>
        </div>
    );
};

export default GameOver;