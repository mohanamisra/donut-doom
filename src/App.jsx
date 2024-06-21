import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Matter from 'matter-js'
import './App.css'

let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;
let boxes = [];

let engine, box1, world;

function sketch(p) {
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        engine = Engine.create();
        world = engine.world;
        box1 = Bodies.rectangle(0, 0, 80, 80);
        Engine.run(engine);
        World.add(world, [box1])
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.mousePressed = function() {
        let newBox = Bodies.rectangle(p.mouseX, p.mouseY, 20, 20);
        boxes.push(newBox);
    }

    p.draw = function () {
        p.background(51);
        for(let i = 0; i < boxes.length; i++) {
            p.rect(boxes[i].position.x, boxes[i].position.y, 20, 20);
            World.add(world, [boxes[i]]);
        }
        p.rect(box1.position.x, box1.position.y, 80, 80)
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
