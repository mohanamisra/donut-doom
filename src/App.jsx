import React from 'react';
import './App.css'
import Game from './pages/Game.jsx';
import Welcome from './pages/Welcome.jsx';

import {Routes, Route, Navigate} from "react-router-dom";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Welcome/>} />
                <Route path="/game" element={<Game/>} />
            </Routes>
        </div>
    );
};

export default App;