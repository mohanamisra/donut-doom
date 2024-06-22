import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Matter from 'matter-js'
import './App.css'
import Box from "./components/Box.jsx";
import Ball from "./components/Ball.jsx";
import Ground from "./components/Ground.jsx";

let Engine = Matter.Engine;
let World = Matter.Composite;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;
let ground, box, ball, world, engine, mCon;

function sketch(p) {
    p.setup = function() {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        engine = Engine.create();
        world = engine.world;

        const canvasMouse = Mouse.create(canvas.elt);
        canvasMouse.pixelRatio = p.pixelDensity();
        const options = {
            mouse: canvasMouse,
        }
        mCon = MouseConstraint.create(engine, options);

        ground = new Ground(p.width/2, p.height - 10, p.width, 20, world);
        box = new Box(300, p.height - 100, 50, 75, world);
        ball = new Ball(50, p.height - 25, 25, world)

        World.add(world, mCon)
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = function () {
        p.background(51);
        Engine.update(engine);
        ground.show(p);
        box.show(p);
        ball.show(p);
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
