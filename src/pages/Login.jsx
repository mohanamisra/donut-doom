import React, {useEffect, useState} from 'react';
import {auth, provider} from "../config.jsx";
import {signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom";

import donutIcon from "../assets/images/donutIcon.webp"
import googleIcon from "../assets/images/googleIcon.webp"
import './Pages.css'

const Login = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');

    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                console.log(data);
                setValue(data.user.email);
                localStorage.setItem("email", data.user.email);
            });
    }

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }

    const handlePlayGame = () => {
        navigate("/game");
    }


    useEffect(() => {
        setValue(localStorage.getItem("email"));
    }, []);

    return (
        <div className = "login-container">
            <div className="text-container">
                <img src={donutIcon} alt = "donut icon" width="100px" className = "donut-icon"/>
                <p className="heading">Welcome To Donut Doom!</p>
                <p className="text">You accidentally wandered into a cemetery late at night after
                    buying a box of those sweet, sweet donuts... <br/><strong>AND WOKE UP THE MONSTERS!</strong></p>
                <p className="text">Quick! Toss the donuts at them to keep them distracted while you figure out how
                    to get
                    out of this sickeningly sweet nightmare!</p>
                {value ? <>
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
        </div>
    );
};

export default Login;