import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Matter from 'matter-js'
import './App.css'
import Ball from "./components/Ball.jsx";
import Boundary from "./components/Boundary.jsx";
import Box from "./components/Box.jsx";
import bg from "./assets/images/background.webp";
import candy from "./assets/images/candy.webp";
import skull from "./assets/images/skull.webp";
import ghost from "./assets/images/ghost.webp";
import zombie from "./assets/images/zombie.webp";
import goblin from "./assets/images/goblin.webp";
import vampire from "./assets/images/vampire.webp";


let Engine = Matter.Engine;
let World = Matter.Composite;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;
let Collision = Matter.Collision;
let ground, ball, world, engine, mCon, leftWall, rightWall, collision;
let boxes = [];
let score = 0;
let timer = 42;
let bgImage, ballImage, skullImage, ghostImage, zombieImage, goblinImage, vampireImage;
let monsterImages = [];
let imgIndex = 0;

function sketch(p) {
    p.preload = async function() {
        bgImage = p.loadImage(bg);
        ballImage = p.loadImage(candy);
        // skullImage = p.loadImage(skull);
        // ghostImage = p.loadImage(ghost);
        // zombieImage = p.loadImage(zombie);
        // goblinImage = p.loadImage(goblin);
        // vampireImage = p.loadImage(vampire);
        monsterImages.push(await p.loadImage(skull));
        monsterImages.push(await p.loadImage(ghost));
        monsterImages.push(await p.loadImage(zombie));
        monsterImages.push(await p.loadImage(goblin));
        monsterImages.push(await p.loadImage(vampire));
    }

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
        ball = new Ball(p.width/2, p.height - 100, 40, world);

        World.add(world, [mCon]);
    }

    setInterval(spawnBoxes, 1500);

    function spawnBoxes() {
        if(boxes.length > 7) {
            World.remove(engine.world, boxes[0].body);
            boxes.splice(0, 1);
        }
        let xLoc = Math.random() * p.width;
        let yLoc = Math.random() * (p.height/2 - 100) + 100;
        if(imgIndex === 3 || imgIndex === 4) {
            boxes.push(new Box(xLoc, yLoc, 105, 85, world, monsterImages[imgIndex]));
        }
        else {
            boxes.push(new Box(xLoc, yLoc, 80, 85, world, monsterImages[imgIndex]));
        }
        imgIndex = (imgIndex + 1) % monsterImages.length;
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.draw = function () {
        p.background(bgImage);
        Engine.update(engine);
        rightWall.show(p);
        leftWall.show(p);
        ground.show(p);
        ball.show(p, ballImage);
        p.textSize(32);
        p.fill("white");
        p.text(`Score: ${score}`, 50, 50);

        for(let i = 0; i < boxes.length; i++) {
            boxes[i].show(p);
        }

        if(ball.body.position.y < 0 || ball.body.position.y > p.height + 50 || ball.body.position.x < 0 || ball.body.position.x > p.width + 50) {
            ball.reset(p);
        }

        for(let i = 0; i < boxes.length; i++) {
            if(Collision.collides(ball.body, boxes[i].body)) {
                console.log("HIT ", i);
                World.remove(engine.world, boxes[i].body);
                boxes.splice(i, 1);
                ball.reset(p);
                score += 5;
            }
        }
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
        <>
            <div ref={p5Container} className="container">
            </div>
        </>
    );
}

export default App;
