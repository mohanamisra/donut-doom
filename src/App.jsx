import React from 'react';
import './App.css'
import Game from './pages/Game.jsx';
import Login from './pages/Login.jsx';

import {Routes, Route, Navigate} from "react-router-dom";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/game" element={<Game/>} />
            </Routes>
        </div>
    );
};

export default App;