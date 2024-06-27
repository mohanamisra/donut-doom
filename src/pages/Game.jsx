import React, { useRef, useEffect } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import p5 from 'p5';
import Matter from 'matter-js'
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
import '@fontsource-variable/pixelify-sans';

let Engine = Matter.Engine;
let World = Matter.Composite;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;
let Collision = Matter.Collision;
let Constraint = Matter.Constraint;
let ground, ball, world, engine, mCon, leftWall, rightWall, scoreBoard;
let boxes = [];
let score = 0;
let timer = 10;
let bgImage, ballImage, scoreboardImage;
let monsterImages = [];
let imgIndex = 0;
let constraint, constraintOptions;
let gameOver = false;

const BALL_CATEGORY = 0b0001;
const MOUSE_CATEGORY = 0b0010;


function Game() {
    const navigate = useNavigate();
    const location = useLocation();
    const p5Container = useRef();

    function sketch(p) {
        p.preload = async function() {
            bgImage = p.loadImage(bg);
            ballImage = p.loadImage(candy);
            scoreboardImage = p.loadImage(scoreboard);
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

            ground = new Boundary(p.width/2, p.height-10, p.width, 20, world, BALL_CATEGORY);
            leftWall = new Boundary(10, p.height/2, 20, p.height, world, BALL_CATEGORY);
            rightWall = new Boundary(p.width - 10, p.height/2, 20, p.height, world, BALL_CATEGORY);
            ball = new Ball(p.width/2, p.height - 100, 40, world, ballImage, BALL_CATEGORY);
            scoreBoard = new Scoreboard( 10, 10, p.width > 800 ? 400 : p.width - 30, 75, world, scoreboardImage);

            const options = {
                mouse: canvasMouse,
                collisionFilter: {
                    category: MOUSE_CATEGORY,
                    mask: 3,
                }
            }
            mCon = MouseConstraint.create(engine, options);


            World.add(world, [mCon]);
            console.log(p.height);
            console.log(p.windowWidth);


            Matter.Events.on(engine, "afterUpdate", () => {
                if(p.mouseIsPressed && p.mouseY < 0.55 * p.height && ball.body.position.y < 0.55 * p.height) {
                    Matter.Body.applyForce(ball.body, {x: ball.body.position.x, y: ball.body.position.y}, {x: 0, y: -150})
                }
                Matter.Body.applyForce(ball.body, {x: ball.body.position.x, y: ball.body.position.y}, {x: 0, y: 0})
            })
        }

        setInterval(spawnBoxes, 500);

        function spawnBoxes() {
            if(boxes.length > 7) {
                World.remove(engine.world, boxes[0].body);
                boxes.splice(0, 1);
            }
            let xLoc = p.random(0, p.width);
            let yLoc = p.random(100, p.height/2);
            let boxWidth, boxHeight;
            let overlapping = false;
            if(imgIndex === 3 || imgIndex === 4) {
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

            for(let j = 0; j < boxes.length; j++) {
                let boxToCheckAgainst = boxes[j];
                let distance = p.dist(boxToPush.x, boxToPush.y ,boxToCheckAgainst.x, boxToCheckAgainst.y);
                if(distance < boxToPush.w + boxToCheckAgainst.w - 80
                    || distance < boxToPush.h + boxToCheckAgainst.h - 80) {
                    overlapping = true;
                    break;
                }
            }
            if(!overlapping) {
                boxes.push(new Box(boxToPush));
                imgIndex = (imgIndex + 1) % monsterImages.length;
            }
        }


        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }

        p.draw = function () {
            p.background(bgImage);
            if(location.state.loggedIn === true ) {
                Engine.update(engine);

                rightWall.show(p);
                leftWall.show(p);
                ground.show(p);
                ball.show(p);
                if(p.frameCount % 60 === 0 && timer > 0) {
                    timer--;
                    if(timer === 0){
                        gameOver = true;
                        console.log("game over");
                        navigate("/leaderboard", {state: {score: score}});
                    }
                }
                scoreBoard.show(p, score, timer);

                for(let i = 0; i < boxes.length; i++) {
                    boxes[i].show(p);
                }

                if(ball.body.position.y < 0 || ball.body.position.y > p.height + 50 || ball.body.position.x < 0 || ball.body.position.x > p.width + 50) {
                    ball.hide();
                    ball.reset(p);
                }

                for(let i = 0; i < boxes.length; i++) {
                    if(Collision.collides(ball.body, boxes[i].body)) {
                        ball.hide();
                        World.remove(engine.world, boxes[i].body);
                        boxes.splice(i, 1);
                        ball.reset(p);
                        score += 1;
                    }
                }
            }
        }
    }
    (function()
    {
        if( window.localStorage )
        {
            if( !localStorage.getItem('firstLoad') )
            {
                localStorage['firstLoad'] = true;
                window.location.reload();
            }
            else
                localStorage.removeItem('firstLoad');
        }
    })();

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

export default Game;