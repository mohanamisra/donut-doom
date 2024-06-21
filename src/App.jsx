import { useState, useRef } from 'react'
import {Engine} from "matter-js/src/module/main.js";
import './App.css'
import Ball from './components/Ball/Ball.jsx'
import Goal from './components/Goal/Goal.jsx'

function App() {
  const scene = useRef();
  const engine = useRef(Engine.create());
  return (
    <div ref = {scene}>
      <Ball/>
      <Goal/>
    </div>
  )
}

export default App
