import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Pages.css'

const GameOver = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handlePlayGame = () => {
        navigate("/game");
    }

    return (
        <div className="game-over-container">
            <div className="leaderboard-container">
                <p className="heading">Game Over</p>
                <div className="text">
                    <p>{location.state ? `Your Score: ${location.state.score}` : `Can't Access Score`}</p>
                    <p>{location.state ? `Your High Score: ${location.state.score}` : `Can't Access Score`}</p>
                </div>
                <button className="play-game-button" onClick={handlePlayGame}>Play Again</button>
            </div>
        </div>
    );
};

export default GameOver;