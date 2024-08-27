// Basic component. Just accesses all kinds of data.
// It gets your current score from the previous screen's state.
// It receives your highscore and the leaderboard from Firebase.
// The only tricky part was to update everything in time for your current score to reflect in
// your highscore and even the leaderboard, *if* it was greater than your previous highscore.

import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
// import {auth, db} from "../config.jsx"
import {doc, getDoc, getDocs, updateDoc, query, orderBy, limit, collection} from "firebase/firestore";
import './Pages.css'

const GameOver = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [player, setPlayer] = useState({});
    const [leaderboard, setLeaderboard] = useState([]);

    const fetchUserData = async() => {
        auth.onAuthStateChanged(async(user) => {
            if(user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    if(location.state.score > docSnap.data().highscore) {
                        await updateDoc(docRef, {
                            ...docSnap.data(),
                            highscore: location.state.score
                        });
                        await fetchLeaderboardData();
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

    const fetchLeaderboardData = async() => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("highscore", "desc"), limit(10));
        const querySnap = await getDocs(q);
        const newLeaderboard = [];
        querySnap.forEach((doc) => {
            newLeaderboard.push(doc.data());
        })
        setLeaderboard(newLeaderboard);
    }

    useEffect(() => {
        fetchUserData();
        fetchLeaderboardData();
    }, []);

    const handlePlayGame = () => {
        if(location.state)
            navigate("/game", {state: {loggedIn: true}});
        else
            navigate("/game");
    }

    return (
        <div className="game-over-container">
            <div className="stats-container">
                <p className="heading">Game Over</p>
                <div className="text">
                    <p><span className="player-stats">{player.username? `RIP ${player.username}`: "Loading username"}</span></p>
                    <p><span className = "player-stats">Your Score: </span>{location.state ? `${location.state.score}` : `Can't Access Score`}</p>
                    <p><span className= "player-stats">Your High Score: </span>{player.highscore ? `${player.highscore}` : `Loading High Score`}</p>
                </div>
                {leaderboard.length > 0 ?
                    <div className="leaderboard-container">
                        <div className="row">
                            <div className="col heading">Rank</div>
                            <div className="col heading">Name</div>
                            <div className="col heading">Score</div>
                        </div>
                        {leaderboard.map((player, index) =>{
                            return(<div className = "row" key = {index}>
                                <div className="col">{index + 1}</div>
                                <div className="col">{player.username}</div>
                                <div className="col">{player.highscore}</div>
                            </div>
                                )
                            }
                        )}
                    </div>
                    : <p>No Leaderboard to display</p>}
                <button className="play-game-button" onClick={handlePlayGame}>Play Again</button>
            </div>
        </div>
    );
};

export default GameOver;