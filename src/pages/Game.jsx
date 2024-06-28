// THIS IS WHERE EVERYTHING HAPPENS!
// The first section right below imports all the assets required (which are a lot!)
// This section can grow in size easily for the simplest games. I am still looking for a way to making this entire
// importing thing cleaner.

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import p5 from 'p5';
import Matter from 'matter-js';
import audioOn from "../assets/images/audioon.webp";
import audioOff from "../assets/images/audiooff.webp";
import Ball from "../components/Ball.jsx";
import Boundary from "../components/Boundary.jsx";
import Box from "../components/Box.jsx";
import Scoreboard from "../components/Scoreboard.jsx";
import bg from "../assets/images/background.webp";
import candy from "../assets/images/candy.webp";
import skull from "../assets/images/skull.webp";
import ghost from "../assets/images/ghost.webp";
import zombie from "../assets/images/zombie.webp";
import goblin from "../assets/images/goblin.webp";
import vampire from "../assets/images/vampire.webp";
import scoreboard from "../assets/images/scoreboard.webp";
import bgMusic from "../assets/music/bgmusic.mp3";
import hitMusic from "../assets/music/hit.mp3"
import '@fontsource-variable/pixelify-sans';

// Now we declare the variables we need.
// In general, global variables aren't preferred because they can easily cause namespace collisions,
// and get manipulated ANYWHERE. That makes it hard to write maintainable and reusable code.
// One of the reasons I have excused myself here is because this was my first attempt at embedding p5 into React
// without any wrapper.
// Definitely a priority to avoid this in future projects!

let Engine = Matter.Engine;
let World = Matter.Composite;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;
let Collision = Matter.Collision;

// The above just helps me write code. It's easier to write Engine.create() rather than Matter.Engine.create(), for example.
// The below are the "true" global variables that I am going to use to make the game.
// They don't just make writing code easy. They are essential.

let ground, ball, world, engine, mCon, leftWall, rightWall, scoreBoard, audioButton;
let boxes = [];
let score = 0;
let timer = 42;
let bgImage, ballImage, scoreboardImage, audioOnImage, audioOffImage;
let monsterImages = [];
let imgIndex = 0;
let gameOver = false;

// Constants! The below constants specifically tell us the collision category of bodies.
// In Matter JS, whether two bodies collide or not depends on their collision category and collision mask.
// Refer to the docs for more info!

const BALL_CATEGORY = 0b0001;
const MOUSE_CATEGORY = 0b0010;

// Behold, the functional component wrapping everything!
// NOTE: Initially I had tried to put the p5 stuff outside the functional component
// but that made a lot of React hooks useless because they'd be declared after the lines that were going to use them.
// I couldn't sacrifice the need for hooks, so here we are, all refactored inside the Game() component.

function Game() {
    // navigate() and location() help in, well, navigation, specifically to the game over screen.
    const navigate = useNavigate();
    const location = useLocation();

    // p5 and audio playing code.
    const p5Container = useRef();
    const audioRef = useRef(new Audio(bgMusic));
    const hitAudioRef = useRef(new Audio(hitMusic));
    // it was too loud otherwise. Would recommend resolving it in some audio manipulation software instead of writing
    // more code.
    hitAudioRef.current.volume = 0.2;
    const [playing, setPlaying] = useState(false);

    // This is a p5 function. It wraps up all of the p5 "stuff".
    function sketch(p) {

        // Preloading image assets makes it so much better at rendering images faster.
        p.preload = async function () {
            bgImage = p.loadImage(bg);
            ballImage = p.loadImage(candy);
            scoreboardImage = p.loadImage(scoreboard);
            monsterImages.push(await p.loadImage(skull));
            monsterImages.push(await p.loadImage(ghost));
            monsterImages.push(await p.loadImage(zombie));
            monsterImages.push(await p.loadImage(goblin));
            monsterImages.push(await p.loadImage(vampire));
            audioOnImage = p.loadImage(audioOn);
            audioOffImage = p.loadImage(audioOff);
        }

        // The world setup. Includes a ton of Matter JS code to setup the game world.
        p.setup = function () {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            engine = Engine.create();
            world = engine.world;
            const canvasMouse = Mouse.create(canvas.elt);
            // If your mouse doesn't know your screen's pixel density, it will lowkey suck identifying
            // where exactly the mouse even is.
            // For all you know, what p5 thinks is a pixel, is actually 4 pixels on your device!
            canvasMouse.pixelRatio = p.pixelDensity();

            // audio playing logic.
            audioButton = p.createImg(audioRef.current.paused ? audioOff : audioOn, "audio button");
            audioButton.position(20, p.height - 50);
            audioButton.size(30, 30);
            audioButton.mouseClicked(() => {
                if (audioRef.current.paused) {
                    audioRef.current.play();
                } else {
                    audioRef.current.pause();
                }
                setPlaying(prevPlaying => !prevPlaying);
                setTimeout(() => {
                    audioButton.elt.src = audioRef.current.paused ? audioOff : audioOn;
                }, 0);
            });

            // Creating the components from the classes defined in "src/components/" folder.
            ground = new Boundary(p.width / 2, p.height - 10, p.width, 20, world, BALL_CATEGORY);
            leftWall = new Boundary(10, p.height / 2, 20, p.height, world, BALL_CATEGORY);
            rightWall = new Boundary(p.width - 10, p.height / 2, 20, p.height, world, BALL_CATEGORY);
            ball = new Ball(p.width / 2, p.height - 100, 40, world, ballImage, BALL_CATEGORY);
            scoreBoard = new Scoreboard(10, 10, p.width > 800 ? 400 : p.width - 30, 75, world, scoreboardImage);

            const options = {
                mouse: canvasMouse,
                collisionFilter: {
                    category: MOUSE_CATEGORY,
                    mask: 3,
                }
            }
            mCon = MouseConstraint.create(engine, options);

            World.add(world, [mCon]);

            // This prevents the ball from rising above the specified area.
            // Note the if conditionals. They detect loads of things such as is the player even dragging the ball to begin with.
            Matter.Events.on(engine, "afterUpdate", () => {
                if (p.mouseIsPressed && p.mouseY < 0.55 * p.height && ball.body.position.y < 0.55 * p.height) {
                    Matter.Body.applyForce(ball.body, { x: ball.body.position.x, y: ball.body.position.y }, { x: 0, y: -150 });
                }
                Matter.Body.applyForce(ball.body, { x: ball.body.position.x, y: ball.body.position.y }, { x: 0, y: 0 });
            });
        }

        // My favourite part of this file. The spawnBoxes() function, in-charge of spawning boxes (monsters in the final implementation)!
        // NOTE: I made the interval shorter because the random() function often generated locations that were overlapping.
        // There must be more elegant ways of resolving an overlap, but since I just ignore those values and make
        // random() regenerate x and y coords, I need a shorter interval.
        // Otherwise spawning boxes would just take forever.
        setInterval(spawnBoxes, 500);

        function spawnBoxes() {
            if (boxes.length > 7) {
                World.remove(engine.world, boxes[0].body);
                boxes.splice(0, 1);
            }
            let xLoc = p.random(0, p.width);
            let yLoc = p.random(100, p.height / 2);
            let boxWidth, boxHeight;
            let overlapping = false;
            if (imgIndex === 3 || imgIndex === 4) {
                boxWidth = 105;
                boxHeight = 85;
            }
            else {
                boxWidth = 80;
                boxHeight = 85;
            }
            let boxToPush = {
                x: xLoc,
                y: yLoc,
                w: boxWidth,
                h: boxHeight,
                world: world,
                img: monsterImages[imgIndex],
            }

            for (let j = 0; j < boxes.length; j++) {
                let boxToCheckAgainst = boxes[j];
                let distance = p.dist(boxToPush.x, boxToPush.y, boxToCheckAgainst.x, boxToCheckAgainst.y);
                if (distance < boxToPush.w + boxToCheckAgainst.w - 80
                    || distance < boxToPush.h + boxToCheckAgainst.h - 80) {
                    overlapping = true;
                    break;
                }
            }
            if (!overlapping) {
                boxes.push(new Box(boxToPush));
                imgIndex = (imgIndex + 1) % monsterImages.length;
            }
        }

        // This makes the canvas responsive.
        p.windowResized = function () {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }

        // The code executed every frame, that is drawing on your screen typically 60 times a second.
        p.draw = function () {
            p.background(bgImage);

            // The below is to avoid someone from just adding "/game" to the base url and appearing at the game page.
            // That would break the leaderboard functionality!
            if (location.state.loggedIn === true) {
                Engine.update(engine);

                rightWall.show(p);
                leftWall.show(p);
                ground.show(p);
                ball.show(p);
                if (p.frameCount % 60 === 0 && timer > 0) {
                    timer--;
                    if (timer === 0) {
                        gameOver = true;
                        navigate("/leaderboard", { state: { score: score } });
                    }
                }
                scoreBoard.show(p, score, timer);

                // It's one thing to spawn boxes...another thing to actually render them on the screen!
                for (let i = 0; i < boxes.length; i++) {
                    boxes[i].show(p);
                }

                // Ball off-screen reset.
                if (ball.body.position.y < 0 || ball.body.position.y > p.height + 50 || ball.body.position.x < 0 || ball.body.position.x > p.width + 50) {
                    ball.hide();
                    ball.reset(p);
                }

                // Collision logic
                for (let i = 0; i < boxes.length; i++) {
                    if (Collision.collides(ball.body, boxes[i].body)) {
                        ball.hide();
                        World.remove(engine.world, boxes[i].body);
                        boxes.splice(i, 1);
                        ball.reset(p);
                        score += 1;
                        hitAudioRef.current.play();
                    }
                }
            }
        }
    }

    useEffect(() => {
        // Create a new p5 instance when this Game() component mounts.
        // This is how all the p5 functions are accessible to us.
        const p5Instance = new p5(sketch, p5Container.current);

        // But you also have to remove it when Game() component unmounts(), as a precaution to remove any
        // potential data leaks.
        // Also, just clean code practice. Remove what you don't need.
        return () => {
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

export default Game;
