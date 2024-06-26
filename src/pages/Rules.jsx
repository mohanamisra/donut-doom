import React from 'react';
import './Pages.css'

const Rules = () => {

    const handleClick = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div className="rules-container">
            Donut Doom Rules
            <button onClick = {handleClick}>Logout</button>
        </div>
    );
};

export default Rules;