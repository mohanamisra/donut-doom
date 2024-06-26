import React from 'react';
import './Pages.css'
import donutIcon from "../assets/images/donutIcon.webp";
import googleIcon from "../assets/images/googleIcon.webp";

const Rules = () => {


    return (
        <div className="login-container">
            <div className="text-container">
                <img src={donutIcon} alt="donut icon" width="100px" className="donut-icon"/>
                <p className="heading">Welcome To Donut Doom!</p>
                <p className="text">You accidentally wandered into a cemetery late at night after
                    buying a box of those sweet, sweet donuts... <br/><strong>AND WOKE UP THE MONSTERS!</strong></p>
                <p className="text">Quick! Toss the donuts at them to keep them distracted while you figure out how
                    to get
                    out of this sickeningly sweet nightmare!</p>
                <button className="login-button" onClick={handleClick}>Login with Google <img src={googleIcon}
                                                                                              width="30px"
                                                                                              className="google-icon"/>
                </button>
            </div>
        </div>
    );
};

export default Rules;