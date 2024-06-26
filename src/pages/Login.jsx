import React, {useEffect, useState} from 'react';
import Rules from "./Rules.jsx";
import {auth, provider} from "../config.jsx";
import {signInWithPopup} from "firebase/auth";

import genBackground from "../assets/images/generalBackground.webp"
import googleIcon from "../assets/images/googleIcon.webp"
import './Pages.css'

const Login = () => {
    const [value, setValue] = useState('');

    const handleClick = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                console.log(data);
                setValue(data.user.email);
                localStorage.setItem("email", data.user.email);
            });
    }

    useEffect(() => {
        setValue(localStorage.getItem("email"));
    }, []);

    return (
        <div>
            {value? <Rules/>
                :
            <div className = "login-container">
                Welcome to Donut Doom!
                <button onClick = {handleClick}>Login with Google</button>
            </div>
            }
        </div>
    );
};

export default Login;