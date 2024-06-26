import React, {useEffect, useState} from 'react';
import {auth, provider} from "../config.jsx";
import {signInWithPopup} from "firebase/auth";

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
            {value? console.log("But you are already logged in...") : null}
            Welcome to Donut Doom!
            <button onClick = {handleClick}>Login with Google</button>
        </div>
    );
};

export default Login;