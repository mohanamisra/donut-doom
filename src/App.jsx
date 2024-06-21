import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Matter from 'matter-js'
import './App.css'
import Box from "./components/Box.jsx";

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let ground, box;

function sketch(p) {
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        ground = new Box(0, p.height - 20, p.width, 20);
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = function () {
        p.background(51);
        ground.show(p);
    }
}

function App() {
    const p5Container = useRef();

    useEffect(() => {
        const p5Instance = new p5(sketch, p5Container.current);

        return() => {
            p5Instance.remove();
        }
    }, []);

    return (
        <div ref={p5Container} className="container">
        </div>
    );
}

export default App;
