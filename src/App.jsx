import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Matter from 'matter-js'
import './App.css'
import Ball from "./components/Ball.jsx";
import Boundary from "./components/Boundary.jsx";
import Box from "./components/Box.jsx";

let Engine = Matter.Engine;
let World = Matter.World;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;
let Collision = Matter.Collision;
let ground, ball, world, engine, mCon, leftWall, rightWall, collision;
let boxes = [];

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

        ground = new Boundary(p.width/2, p.height-10, p.width, 20, world);
        leftWall = new Boundary(10, p.height/2, 20, p.height, world);
        rightWall = new Boundary(p.width - 10, p.height/2, 20, p.height, world);
        ball = new Ball(p.width/2, p.height - 100, 25, world);

        World.add(world, [mCon]);
    }

    // setInterval(spawnBoxes, 1000);

    function spawnBoxes() {
        let xLoc = Math.random() * p.width;
        let yLoc = Math.random() * ((p.height/2 - 20) + 20);
        boxes.push(new Box(xLoc, yLoc, 50, 50, world));
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = function () {
        p.background(51);
        Engine.update(engine);
        rightWall.show(p);
        leftWall.show(p);
        ground.show(p);
        ball.show(p);

        for(let i = 0; i < boxes.length; i++) {
            boxes[i].show(p);
        }

        if(ball.body.position.y < 0 || ball.body.position.y > p.height + 50 || ball.body.position.x < 0 || ball.body.position.x > p.width + 50) {
            Matter.Body.setPosition(ball.body, {x: p.width/2, y: p.height - 100});
            Matter.Body.setAngle(ball.body, 0);
            // Matter.Body.setVelocity(ball.body, {x: 0, y: 0});
            Matter.Body.setSpeed(ball.body, 0);
        }

        // if(Collision.collides(ball.body, box.body))
        //     console.log("HIT");
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
