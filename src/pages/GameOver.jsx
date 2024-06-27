import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {auth, db} from "../config.jsx"
import {doc, getDoc, updateDoc} from "firebase/firestore";
import './Pages.css'

const GameOver = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [player, setPlayer] = useState({});

    const fetchUserData = async() => {
        auth.onAuthStateChanged(async(user) => {
            if(user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    if(location.state.score > docSnap.data().highscore) {
                        console.log(user.uid);
                        await updateDoc(docRef, {
                            ...docSnap.data(),
                            highscore: location.state.score
                        })
                    }
                    setPlayer(
                        location.state.score > docSnap.data().highscore?
                            {...docSnap.data(), highscore: location.state.score}:
                            docSnap.data()
                    );
                }
            }
        })
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const handlePlayGame = () => {
        navigate("/game");
    }

    return (
        <div className="game-over-container">
            <div className="leaderboard-container">
                <p className="heading">Game Over</p>
                <div className="text">
                    <p>{player.username? `${player.username}`: "Loading username"}</p>
                    <p>{location.state ? `Your Score: ${location.state.score}` : `Can't Access Score`}</p>
                    <p>{player.highscore ? `Your High Score: ${player.highscore}` : `Loading High Score`}</p>
                </div>
                <button className="play-game-button" onClick={handlePlayGame}>Play Again</button>
            </div>
        </div>
    );
};

export default GameOver;