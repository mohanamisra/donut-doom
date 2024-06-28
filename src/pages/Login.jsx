// This is a typical React login page.
// Beyond just UI stuff which differs from project to project,
// I have implemented only login via google.
// That is secure, delegated to Firebase to manage, and takes away a lot of validation requirements from me.

import React, {useEffect, useState, useRef} from 'react';
import {auth, provider, db} from "../config.jsx";
import {signInWithPopup} from "firebase/auth";
import {setDoc, getDoc, doc} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

import bgMusic from "../assets/music/bgmusic.mp3"
import audioOff from "../assets/images/audiooff.webp"
import audioOn from "../assets/images/audioon.webp"
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
                if(data.user) {
                    let player = await getDoc(doc(db, "users", data.user.uid));

                    // if the above player document doesn't exist in the database, that means this is the first time the player has ever logged in!
                    // So we need them to enter a username, the component for which needs to be visible at this point.
                    if(!player._document) {
                        setUserID(data.user.uid);
                        setVisible(true);
                    }
                }
                setValue(data.user.email);
                // So that the device remembers you have already logged in once!
                localStorage.setItem("email", data.user.email);
            });
    }

    // Basic logout functionality.
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handlePlayGame = () => {
        navigate("/game", {state: {loggedIn: true}});
    }

    // newUsername because in React, you do not manipulate the state directly.
    const handleInputChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
    }

    const handleSetUsername = async() => {
        if(username === "") {
            // Error message
            alert("Invalid username!");
        }
        else {
            await setDoc(doc(db, "users", userID), {
                username: username,
                highscore: 0,
            });

            // Done entering username? Cool.
            // We now remove the component that accepted your username by setting its visibility to false.
            setVisible(false);
        }
    }

    // Audio playing logic. Was surprisingly more finnicky than I expected, across the project.
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

    // Tons of conditional rendering below.
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
