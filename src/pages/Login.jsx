import React, {useEffect, useState, useRef} from 'react';
import {auth, provider, db} from "../config.jsx";
import {signInWithPopup} from "firebase/auth";
import {setDoc, getDoc, doc} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

import bgMusic from "../assets/music/bgmusic.mp3"
import audioOn from "../assets/images/audioon.webp"
import audioOff from "../assets/images/audiooff.webp"
import googleIcon from "../assets/images/googleIcon.webp"
import './Pages.css'

const Login = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [userID, setUserID] = useState('');
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async(data) => {
                console.log(data.user.uid);
                if(data.user) {
                    let player = await getDoc(doc(db, "users", data.user.uid));
                    if(!player._document) {
                        setUserID(data.user.uid);
                        console.log("player data not detected");
                        setVisible(true);
                    }
                }
                setValue(data.user.email);
                localStorage.setItem("email", data.user.email);
            });
    }

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handlePlayGame = () => {
        navigate("/game", {state: {loggedIn: true}});
    }

    const handleInputChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
    }

    const handleSetUsername = async() => {
        console.log(userID);
        console.log(username);
        if(username === "") {
            alert("Invalid username!");
        }
        else {
            await setDoc(doc(db, "users", userID), {
                username: username,
                highscore: 0,
            });
            setVisible(false);
        }
    }

    const handleAudioClick = () => {
        if (audioRef.current) {
            if (!playing) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
            setPlaying(!playing);
        }
    }

    useEffect(() => {
        setValue(localStorage.getItem("email"));

        if (!audioRef.current) {
            audioRef.current = new Audio(bgMusic);
            audioRef.current.loop = true;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [visible]);

    return (
        <div className="login-container">
            {visible?
                <div className="username-form">
                    <p className="heading">Wait a sec!</p>
                    <p className="text">Please enter your username first.</p>
                    <input type="text"
                           placeholder="Enter username..."
                           value={username}
                           onChange={handleInputChange}
                           className="username-input"
                    />
                    <button className="set-username-button"
                            onClick={handleSetUsername}>Done
                    </button>
                </div>
                : <div className="text-container">
                    <img src={playing ? audioOn : audioOff} alt="donut icon" width="120px" className="donut-icon" onClick={handleAudioClick}/>
                    <p className="heading">Welcome To Donut Doom!</p>
                    <p className="text">You accidentally wandered into a cemetery late at night after
                        buying a box of those sweet, sweet donuts... <br/><strong>AND WOKE UP THE MONSTERS!</strong></p>
                    <p className="text">Quick! Toss the donuts at them to keep them distracted while you figure out how
                        to get out of this sickeningly sweet nightmare!</p>
                    {value? <>
                            <button className="play-game-button" onClick={handlePlayGame}>Play Game</button>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </>
                        :
                        <button className="login-button" onClick={handleLogin}>Login with Google <img src={googleIcon}
                                                                                                      width="30px"
                                                                                                      className="google-icon"/>
                        </button>
                    }
                </div>
            }
        </div>
    );
};

export default Login;
